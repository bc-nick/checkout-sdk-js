import { createFormPoster } from '@bigcommerce/form-poster';
import { createRequestSender, RequestSender, Response } from '@bigcommerce/request-sender';
import { createScriptLoader, getScriptLoader } from '@bigcommerce/script-loader';

import {
    MissingDataError,
    MissingDataErrorType,
    OrderRequestBody,
    PaymentArgumentInvalidError,
    PaymentInitializeOptions,
    PaymentIntegrationService,
} from '@bigcommerce/checkout-sdk/payment-integration-api';
import { PaymentIntegrationServiceMock } from '@bigcommerce/checkout-sdk/payment-integrations-test-utils';

import { WithGooglePayPaymentInitializeOptions } from '../google-pay-payment-initialize-options';
import GooglePayPaymentProcessor from '../google-pay-payment-processor';
import GooglePayScriptLoader from '../google-pay-script-loader';
import { getGeneric } from '../mocks/google-pay-payment-method.mock';

import GooglePayGateway from './google-pay-paypal-commerce-gateway';
import GooglePayPaymentStrategy from './google-pay-paypal-commerce-payment-strategy';
import PayPalCommerceScriptLoader from './google-pay-paypal-commerce-script-loader';

describe('PayPalCommerceGooglePayPaymentStrategy', () => {
    const BUTTON_ID = 'my_awesome_google_pay_button';

    let paymentIntegrationService: PaymentIntegrationService;
    let processor: GooglePayPaymentProcessor;
    let strategy: GooglePayPaymentStrategy;
    let options: PaymentInitializeOptions & WithGooglePayPaymentInitializeOptions;
    let button: HTMLDivElement;
    let scriptLoader: PayPalCommerceScriptLoader;
    let requestSender: RequestSender;
    let response: Response<{ orderId: string }>;

    beforeEach(() => {
        paymentIntegrationService = new PaymentIntegrationServiceMock();
        scriptLoader = new PayPalCommerceScriptLoader(getScriptLoader());
        requestSender = createRequestSender();
        jest.spyOn(paymentIntegrationService.getState(), 'getPaymentMethodOrThrow').mockReturnValue(
            getGeneric(),
        );

        processor = new GooglePayPaymentProcessor(
            new GooglePayScriptLoader(createScriptLoader()),
            new GooglePayGateway(paymentIntegrationService, scriptLoader),
            createRequestSender(),
            createFormPoster(),
        );
        jest.spyOn(processor, 'initialize').mockResolvedValue(undefined);
        jest.spyOn(processor, 'processAdditionalAction').mockResolvedValue(undefined);
        jest.spyOn(processor, 'getNonce').mockResolvedValue('nonceValue');
        jest.spyOn(scriptLoader, 'getGooglePayConfigOrThrow').mockResolvedValue({});

        jest.spyOn(scriptLoader, 'getPayPalGooglePaySdkOrThrow').mockResolvedValue({
            Googlepay: jest.fn().mockReturnValue({
                config: jest.fn(),
                confirmOrder: jest.fn().mockResolvedValue({ status: 'APPROVED' }),
            }),
        });

        strategy = new GooglePayPaymentStrategy(
            paymentIntegrationService,
            processor,
            scriptLoader,
            requestSender,
        );

        response = { body: { orderId: '111' } } as Response<{ orderId: string }>;
        jest.spyOn(requestSender, 'post').mockResolvedValue(response);

        options = {
            methodId: 'googlepaypaypalcommerce',
            googlepaypaypalcommerce: {
                walletButton: BUTTON_ID,
                onError: jest.fn(),
                onPaymentSelect: jest.fn(),
            },
        };
    });

    beforeAll(() => {
        button = document.createElement('div');

        button.id = BUTTON_ID;

        document.body.appendChild(button);

        jest.spyOn(button, 'addEventListener');
        jest.spyOn(button, 'removeEventListener');
    });

    afterEach(() => {
        (button.addEventListener as jest.Mock).mockClear();
        (button.removeEventListener as jest.Mock).mockClear();
    });

    describe('#execute', () => {
        let payload: OrderRequestBody;

        beforeEach(async () => {
            payload = {
                payment: {
                    methodId: 'example',
                },
            };

            jest.spyOn(
                paymentIntegrationService.getState(),
                'getPaymentMethodOrThrow',
            ).mockReturnValue({
                ...getGeneric(),
                initializationData: {
                    ...getGeneric().initializationData,
                    nonce: 'abc.123.xyz',
                    card_information: {
                        type: '',
                        number: '',
                    },
                    merchantId: 'merchantId',
                    clientId: 'clientId',
                },
                clientToken: 'clientToken',
            });

            await strategy.initialize(options);
        });

        it('should execute the strategy', async () => {
            await scriptLoader.getPayPalGooglePaySdkOrThrow('123', '321', '222');

            const execute = strategy.execute(payload);

            await expect(execute).resolves.toBeUndefined();
        });

        it('should call getPaymentMethodOrThrow', async () => {
            await strategy.execute(payload);

            expect(paymentIntegrationService.getState().getPaymentMethodOrThrow).toHaveBeenCalled();
        });

        it('should submit the order', async () => {
            await strategy.execute(payload);

            expect(paymentIntegrationService.submitOrder).toHaveBeenCalled();
        });

        it('should submit the payment', async () => {
            await strategy.execute(payload);

            const paymentData = {
                formattedPayload: {
                    method_id: 'example',
                    paypal_account: {
                        order_id: '111',
                    },
                },
            };

            expect(paymentIntegrationService.submitPayment).toHaveBeenCalledWith({
                methodId: 'example',
                paymentData,
            });
        });

        it('should process additional action', async () => {
            jest.spyOn(paymentIntegrationService, 'submitPayment').mockRejectedValue('error');

            await strategy.execute(payload);

            expect(processor.processAdditionalAction).toHaveBeenCalledWith('error');
        });

        describe('should fail if:', () => {
            test('payment is missing', async () => {
                const execute = strategy.execute({});

                await expect(execute).rejects.toThrow(PaymentArgumentInvalidError);
            });

            test('methodId is empty', async () => {
                const execute = strategy.execute({
                    payment: {
                        methodId: '',
                    },
                });

                await expect(execute).rejects.toThrow(PaymentArgumentInvalidError);
            });

            test('nonce is missing', async () => {
                const execute = () => strategy.execute(payload);

                jest.spyOn(processor, 'getNonce').mockRejectedValue(
                    new MissingDataError(MissingDataErrorType.MissingPaymentToken),
                );

                await expect(execute()).rejects.toThrow(MissingDataError);
            });
        });
    });
});
