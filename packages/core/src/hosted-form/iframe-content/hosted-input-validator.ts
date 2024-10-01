import { creditCardType, cvv, expirationDate, number } from 'card-validator';
import { object, ObjectShape, string, StringSchema, ValidationError } from 'yup';

import { CardInstrument } from '../../payment/instrument';

import { HostedInputValidateErrorDataMap } from './hosted-input-validate-error-data';
import HostedInputValidateResults from './hosted-input-validate-results';
import HostedInputValues from './hosted-input-values';

export default class HostedInputValidator {
    private readonly _completeSchema: ObjectShape = {
        cardCode: this._getCardCodeSchema(),
        cardCodeVerification: this._getCardCodeVerificationSchema(),
        cardExpiry: this._getCardExpirySchema(),
        cardName: this._getCardNameSchema(),
        cardNumber: this._getCardNumberSchema(),
        cardNumberVerification: this._getCardNumberVerificationSchema(),
    };

    constructor(private _cardInstrument?: CardInstrument) {
        this._configureCardValidator();
    }

    async validate(values: HostedInputValues): Promise<HostedInputValidateResults> {
        const schemas: ObjectShape = {};
        const results: HostedInputValidateResults = {
            errors: {},
            isValid: true,
        };

        let requiredField: keyof HostedInputValues;

        for (requiredField in values) {
            if (Object.prototype.hasOwnProperty.call(values, requiredField)) {
                schemas[requiredField] = this._completeSchema[requiredField];
                results.errors[requiredField] = [];
            }
        }

        try {
            await object(schemas).validate(values, { abortEarly: false });

            return results;
        } catch (error) {
            if (this._isValidationErrorType(error)) {
                throw error;
            }

            return {
                errors: (
                    Object.keys(results.errors) as Array<keyof HostedInputValidateErrorDataMap>
                ).reduce(
                    (result, fieldType) => ({
                        ...result,
                        [fieldType]: (error as ValidationError).inner
                            .filter((innerError) => innerError.path === fieldType)
                            .map((innerError) => ({
                                fieldType: innerError.path,
                                message: innerError.errors.join(' '),
                                type: innerError.type,
                            })),
                    }),
                    {} as HostedInputValidateErrorDataMap,
                ),
                isValid: false,
            };
        }
    }

    private _configureCardValidator(): void {
        const discoverInfo = creditCardType.getTypeInfo('discover');
        const jcbInfo = creditCardType.getTypeInfo('jcb');
        const visaInfo = creditCardType.getTypeInfo('visa');

        // Need to support 13 digit PAN because some gateways only provide test credit card numbers in this format.
        creditCardType.updateCard('visa', {
            lengths: [13, ...(visaInfo.lengths || [])],
        });

        // Add support for 8-BIN Discover Cards.
        creditCardType.updateCard('discover', {
            patterns: [...(discoverInfo.patterns || []), [810, 817]],
        });

        creditCardType.addCard({
            niceType: 'Mada',
            type: 'mada',
            patterns: [
                400861, 401757, 407197, 407395, 409201, 410685, 412565, 417633, 419593, 422817,
                422818, 422819, 428331, 428671, 428672, 428673, 431361, 432328, 434107, 439954,
                440533, 440647, 440795, 445564, 446393, 446404, 446672, 455036, 455708, 457865,
                458456, 462220, 468540, 468541, 468542, 468543, 483010, 483011, 483012, 484783,
                486094, 486095, 486096, 489317, 489318, 489319, 493428, 504300, 506968, 508160,
                513213, 520058, 521076, 524130, 524514, 529415, 529741, 530060, 530906, 531095,
                531196, 532013, 535825, 535989, 536023, 537767, 539931, 543085, 543357, 549760,
                554180, 557606, 558848, 585265, 588845, 588846, 588847, 588848, 588849, 588850,
                588851, 588982, 588983, 589005, 589206, 604906, 605141, 636120, 968201, 968202,
                968203, 968204, 968205, 968206, 968207, 968208, 968209, 968210, 968211,
            ],
            gaps: [4, 8, 12],
            lengths: [16, 18, 19],
            code: {
                name: 'CVV',
                size: 3,
            },
        });

        // Add support WorldPayAccess and Authorize.net test cards
        creditCardType.updateCard('jcb', {
            patterns: [...(jcbInfo.patterns || []), 3088, 3337, 3338],
        });
    }

    private _getCardCodeSchema(): StringSchema {
        return string()
            .required('CVV is required')
            .test({
                message: 'CVV must be valid',
                name: 'invalid_card_code',
                test(value) {
                    const { card } = number((this.parent as HostedInputValues).cardNumber || '');

                    return cvv(value, card && card.code ? card.code.size : undefined).isValid;
                },
            });
    }

    private _getCardCodeVerificationSchema(): StringSchema {
        return string()
            .required('CVV is required')
            .test({
                message: 'CVV must be valid',
                name: 'invalid_card_code',
                test: (value = '') => {
                    const cardType =
                        this._cardInstrument &&
                        this._mapFromInstrumentCardType(this._cardInstrument.brand);
                    const cardInfo = cardType && creditCardType.getTypeInfo(cardType);

                    return cvv(value, cardInfo && cardInfo.code ? cardInfo.code.size : undefined)
                        .isValid;
                },
            });
    }

    private _getCardExpirySchema(): StringSchema {
        return string()
            .required('Expiration date is required')
            .test({
                message: 'Expiration date must be a valid future date in MM / YY format',
                name: 'invalid_card_expiry',
                test: (value) => expirationDate(value).isValid,
            });
    }

    private _getCardNameSchema(): StringSchema {
        return string().max(200).required('Full name is required');
    }

    private _getCardNumberSchema(): StringSchema {
        return string()
            .required('Credit card number is required')
            .test({
                message: 'Credit card number must be valid',
                name: 'invalid_card_number',
                test: (value) => number(value).isValid,
            });
    }

    private _getCardNumberVerificationSchema(): StringSchema {
        return string()
            .required('Credit card number is required')
            .test({
                message: 'Credit card number must be valid',
                name: 'invalid_card_number',
                test: (value = '') => number(value).isValid,
            })
            .test({
                message: 'The card number entered does not match the card stored in your account',
                name: 'mismatched_card_number',
                test: (value = '') =>
                    this._cardInstrument
                        ? value.slice(-this._cardInstrument.last4.length) ===
                          this._cardInstrument.last4
                        : false,
            });
    }

    private _mapFromInstrumentCardType(type: string): string {
        switch (type) {
            case 'amex':
            case 'american_express':
                return 'american-express';

            case 'diners':
                return 'diners-club';

            default:
                return type;
        }
    }

    private _isValidationErrorType(error: any): error is { name: string } {
        return 'name' in error && error.name !== 'ValidationError';
    }
}
