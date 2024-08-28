(()=>{"use strict";var e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{createHostedFormService:()=>F});const n=require("tslib"),r=require("lodash"),i=function(e){var t=this,n=new Promise((function(e,n){t.cancel=n}));this.promise=Promise.race([e,n])},o=function(e){function t(t){var n,r,i=this.constructor,o=e.call(this,t||"An unexpected error has occurred.")||this;return o.name="StandardError",o.type="standard",n=o,r=i.prototype,Object.setPrototypeOf?Object.setPrototypeOf(n,r):n.__proto__=r,"function"==typeof Error.captureStackTrace?Error.captureStackTrace(o,i):o.stack=new Error(o.message).stack,o}return(0,n.__extends)(t,e),t}(Error),a=function(e){function t(t){var n=e.call(this,t||"Unable to proceed because the required element is unexpectedly detached from the page.")||this;return n.name="UnexpectedDetachmentError",n.type="unexpected_detachment",n}return(0,n.__extends)(t,e),t}(o),s=function(){function e(e){this._mutationObserver=e}return e.prototype.ensurePresence=function(e,t){return(0,n.__awaiter)(this,void 0,void 0,(function(){var r,o,s,u;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:r=new i(t),(o=this._mutationObserver.create((function(t){t.forEach((function(t){0!==Array.from(t.removedNodes).filter((function(t){return e.some((function(e){return t===e||t.contains(e)}))})).length&&r.cancel(new a)}))}))).observe(document.body,{childList:!0,subtree:!0}),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,r.promise];case 2:return s=n.sent(),o.disconnect(),[2,s];case 3:throw u=n.sent(),o.disconnect(),u;case 4:return[2]}}))}))},e}();var u=function(){function e(e){void 0===e&&(e=window),this._window=e}return e.prototype.create=function(e){return new this._window.MutationObserver(e)},e}();const c=require("rxjs"),d=require("rxjs/operators"),h=function(e){function t(t){var n=e.call(this,t||"Invalid arguments have been provided.")||this;return n.name="InvalidArgumentError",n.type="invalid_argument",n}return(0,n.__extends)(t,e),t}(o);function l(e){if(!/^(https?:)?\/\//.test(e))throw new h("The provided URL must be absolute.");var t=document.createElement("a");t.href=e;var n=t.port&&-1!==e.indexOf(t.hostname+":"+t.port)?t.port:"";return{hash:t.hash,hostname:t.hostname,href:t.href,origin:t.protocol+"//"+t.hostname+(n?":"+n:""),pathname:t.pathname,port:n,protocol:t.protocol,search:t.search}}function p(e,t){return e.type===t}const f=function(){function e(e,t,n){this._targetWindow=t,this._context=n,this._targetOrigin="*"===e?"*":l(e).origin}return e.prototype.post=function(e,t){var r=this,i=this._targetWindow;if(window!==i){if(!i)throw new Error("Unable to post message because target window is not set.");var o=t&&(0,c.fromEvent)(window,"message").pipe((0,d.filter)((function(e){return e.origin===r._targetOrigin&&p(e.data,e.data.type)&&-1!==[t.successType,t.errorType].indexOf(e.data.type)})),(0,d.map)((function(e){if(t.errorType===e.data.type)throw e.data;return e.data})),(0,d.take)(1)).toPromise();return i.postMessage((0,n.__assign)((0,n.__assign)({},e),{context:this._context}),this._targetOrigin),o}},e.prototype.setTarget=function(e){this._targetWindow=e},e.prototype.setContext=function(e){this._context=e},e}(),_=function(e,t,r){return t&&r?m(0,t,r):function(e){var t=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return(0,n.__extends)(t,e),t}(e);return Object.getOwnPropertyNames(e.prototype).forEach((function(n){var r=Object.getOwnPropertyDescriptor(e.prototype,n);r&&"constructor"!==n&&Object.defineProperty(t.prototype,n,m(e.prototype,n,r))})),t}(e)};function m(e,t,r){if("function"!=typeof r.value)return r;var i=r.value;return{get:function(){var e=i.bind(this);return Object.defineProperty(this,t,(0,n.__assign)((0,n.__assign)({},r),{value:e})),e},set:function(e){i=e}}}const v=function(){function e(e){var t;this._sourceOrigins=[l(e).origin,(t=l(e),l(0===t.hostname.indexOf("www")?t.href:t.href.replace(t.hostname,"www."+t.hostname))).origin],this._isListening=!1,this._listeners={}}return e.prototype.listen=function(){this._isListening||(this._isListening=!0,window.addEventListener("message",this._handleMessage))},e.prototype.stopListen=function(){this._isListening&&(this._isListening=!1,window.removeEventListener("message",this._handleMessage))},e.prototype.addListener=function(e,t){var n=this._listeners[e];n||(this._listeners[e]=n=[]),-1===n.indexOf(t)&&n.push(t)},e.prototype.removeListener=function(e,t){var n=this._listeners[e];if(n){var r=n.indexOf(t);r>=0&&n.splice(r,1)}},e.prototype.trigger=function(e,t){var n=this._listeners[e.type];n&&n.forEach((function(n){return t?n(e,t):n(e)}))},e.prototype._handleMessage=function(e){if(-1!==this._sourceOrigins.indexOf(e.origin)&&p(e.data,e.data.type)){var t=e.data,r=t.context,i=(0,n.__rest)(t,["context"]);this.trigger(i,r)}},(0,n.__decorate)([_],e.prototype,"_handleMessage",null),e}(),y=function(e){function t(t){var n=e.call(this,t||"Unable to proceed due to invalid configuration provided for the hosted payment form.")||this;return n.name="InvalidHostedFormConfigError",n.type="invalid_hosted_form_config",n}return(0,n.__extends)(t,e),t}(o),g=function(e){function t(t){var n=e.call(this,t||"Unable to proceed due to an unknown error with the hosted payment form.")||this;return n.name="InvalidHostedFormError",n.type="invalid_hosted_form",n}return(0,n.__extends)(t,e),t}(o),b=function(e){function t(t){var i=e.call(this,(0,n.__spreadArrays)(["Unable to proceed due to invalid user input values"],(0,r.flatMap)((0,r.values)(t),(function(e){return(0,r.map)(e,(function(e){return e.message}))}))).join(". "))||this;return i.errors=t,i.name="InvalidHostedFormValueError",i.type="invalid_hosted_form_value",i}return(0,n.__extends)(t,e),t}(o);var w,E;!function(e){e.AttachRequested="HOSTED_FIELD:ATTACH_REQUESTED",e.SubmitManualOrderRequested="HOSTED_FIELD:SUBMIT_MANUAL_ORDER_REQUESTED",e.ValidateRequested="HOSTED_FIELD:VALIDATE_REQUESTED"}(w||(w={})),function(e){e.AttachSucceeded="HOSTED_INPUT:ATTACH_SUCCEEDED",e.AttachFailed="HOSTED_INPUT:ATTACH_FAILED",e.BinChanged="HOSTED_INPUT:BIN_CHANGED",e.Blurred="HOSTED_INPUT:BLURRED",e.Changed="HOSTED_INPUT:CHANGED",e.CardTypeChanged="HOSTED_INPUT:CARD_TYPE_CHANGED",e.Entered="HOSTED_INPUT:ENTERED",e.Focused="HOSTED_INPUT:FOCUSED",e.SubmitManualOrderSucceeded="HOSTED_INPUT:SUBMIT_MANUAL_ORDER_SUCCEEDED",e.SubmitManualOrderFailed="HOSTED_INPUT:SUBMIT_MANUAL_ORDER_FAILED",e.Validated="HOSTED_INPUT:VALIDATED"}(E||(E={}));const O=function(){function e(e,t,n,r,i,o,a,s,u){this._type=e,this._containerId=t,this._orderId=n,this._placeholder=r,this._accessibilityLabel=i,this._styles=o,this._eventPoster=a,this._eventListener=s,this._detachmentObserver=u,this._iframe=document.createElement("iframe"),this._iframe.src="/admin/payments/"+this._orderId+"/hosted-form-field?version=1.648.0",this._iframe.style.border="none",this._iframe.style.height="100%",this._iframe.style.overflow="hidden",this._iframe.style.width="100%"}return e.prototype.getType=function(){return this._type},e.prototype.attach=function(){return(0,n.__awaiter)(this,void 0,void 0,(function(){var e,t,r=this;return(0,n.__generator)(this,(function(i){switch(i.label){case 0:if(!(e=document.getElementById(this._containerId)))throw new y("Unable to proceed because the provided container ID is not valid.");return e.appendChild(this._iframe),this._eventListener.listen(),t=(0,c.fromEvent)(this._iframe,"load").pipe((0,d.switchMap)((function(e){var t=e.target;return(0,n.__awaiter)(r,void 0,void 0,(function(){var e;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:if(!(e=t&&t.contentWindow))throw new Error("The content window of the iframe cannot be accessed.");return this._eventPoster.setTarget(e),[4,this._eventPoster.post({type:w.AttachRequested,payload:{accessibilityLabel:this._accessibilityLabel,fontUrls:this._getFontUrls(),placeholder:this._placeholder,styles:this._styles,origin:document.location.origin,type:this._type}},{successType:E.AttachSucceeded,errorType:E.AttachFailed})];case 1:return n.sent(),[2]}}))}))})),(0,d.take)(1)).toPromise(),[4,this._detachmentObserver.ensurePresence([this._iframe],t)];case 1:return i.sent(),[2]}}))}))},e.prototype.detach=function(){this._iframe.parentElement&&(this._iframe.parentElement.removeChild(this._iframe),this._eventListener.stopListen())},e.prototype.submitManualOrderForm=function(e){return(0,n.__awaiter)(this,void 0,void 0,(function(){var t,r;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),t=this._eventPoster.post({type:w.SubmitManualOrderRequested,payload:{data:e}},{successType:E.SubmitManualOrderSucceeded,errorType:E.SubmitManualOrderFailed}),[4,this._detachmentObserver.ensurePresence([this._iframe],t)];case 1:return[2,n.sent()];case 2:if(r=n.sent(),this._isSubmitManualOrderErrorEvent(r)){if("hosted_form_error"===r.payload.error.code)throw new g(r.payload.error.message);throw new Error(r.payload.error.message)}throw r;case 3:return[2]}}))}))},e.prototype.validateForm=function(){return(0,n.__awaiter)(this,void 0,void 0,(function(){var e,t;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return e=this._eventPoster.post({type:w.ValidateRequested},{successType:E.Validated}),[4,this._detachmentObserver.ensurePresence([this._iframe],e)];case 1:if(!(t=n.sent().payload).isValid)throw new b(t.errors);return[2]}}))}))},e.prototype._getFontUrls=function(){var e=this,t="fonts.googleapis.com",n=document.querySelectorAll("link[href*='"+t+"'][rel='stylesheet']");return Array.prototype.slice.call(n).filter((function(e){return l(e.href).hostname===t})).filter((function(t){return(0,r.values)(e._styles).map((function(e){return e&&e.fontFamily})).filter((function(e){return"string"==typeof e})).some((function(e){return e.split(/,\s/).some((function(e){return-1!==t.href.indexOf(e.replace(" ","+"))}))}))})).map((function(e){return e.href}))},e.prototype._isSubmitManualOrderErrorEvent=function(e){return e instanceof Object&&null!==e&&"type"in e&&e.type===E.SubmitManualOrderFailed},e}(),T=function(){function e(e,t,i){var o=this;this._fields=e,this._eventListener=t,this._eventCallbacks=i,this._handleEnter=function(e){var t=e.payload;return(0,n.__awaiter)(o,void 0,void 0,(function(){var e,i;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,this.validate()];case 1:return n.sent(),[3,3];case 2:if("InvalidHostedFormValueError"!==(e=n.sent()).name)throw e;return[3,3];case 3:return(void 0===(i=this._eventCallbacks.onEnter)?r.noop:i)(t),[2]}}))}))};var a=this._eventCallbacks,s=a.onBlur,u=void 0===s?r.noop:s,c=a.onCardTypeChange,d=void 0===c?r.noop:c,h=a.onFocus,l=void 0===h?r.noop:h,p=a.onValidate,f=void 0===p?r.noop:p;this._eventListener.addListener(E.Blurred,(function(e){var t=e.payload;return u(t)})),this._eventListener.addListener(E.CardTypeChanged,(function(e){var t=e.payload;return d(t)})),this._eventListener.addListener(E.Focused,(function(e){var t=e.payload;return l(t)})),this._eventListener.addListener(E.Validated,(function(e){var t=e.payload;return f(t)})),this._eventListener.addListener(E.Entered,this._handleEnter),this._eventListener.addListener(E.CardTypeChanged,(function(e){var t=e.payload;return o._cardType=t.cardType})),this._eventListener.addListener(E.BinChanged,(function(e){var t=e.payload;return o._bin=t.bin}))}return e.prototype.getBin=function(){return this._bin},e.prototype.getCardType=function(){return this._cardType},e.prototype.attach=function(){return(0,n.__awaiter)(this,void 0,void 0,(function(){var e,t;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:return this._eventListener.listen(),e=this._getFirstField(),t=(0,r.without)(this._fields,e),[4,e.attach()];case 1:return n.sent(),[4,Promise.all(t.map((function(e){return e.attach()})))];case 2:return n.sent(),[2]}}))}))},e.prototype.detach=function(){this._eventListener.stopListen(),this._fields.forEach((function(e){e.detach()}))},e.prototype.submitManualOrderPayment=function(e){return(0,n.__awaiter)(this,void 0,void 0,(function(){return(0,n.__generator)(this,(function(t){return[2,this._getFirstField().submitManualOrderForm(e.data)]}))}))},e.prototype.validate=function(){return(0,n.__awaiter)(this,void 0,void 0,(function(){return(0,n.__generator)(this,(function(e){return[2,this._getFirstField().validateForm()]}))}))},e.prototype._getFirstField=function(){var e=this._fields[0];if(!e)throw new y("Unable to proceed because the payment form has no field defined.");return e},e}(),I=function(){function e(){}return e.prototype.create=function(e,t){var i=Object.keys(t.fields).reduce((function(r,i){var o=t.fields[i];return o?(0,n.__spreadArrays)(r,[new O(i,o.containerId,t.orderId,o.placeholder||"",o.accessibilityLabel||"",t.styles||{},new f(e),new v(e),new s(new u))]):r}),[]);return new T(i,new v(e),(0,r.pick)(t,"onBlur","onEnter","onFocus","onCardTypeChange","onValidate"))},e}();var S;!function(e){e[e.CheckoutButtonNotInitialized=0]="CheckoutButtonNotInitialized",e[e.CustomerNotInitialized=1]="CustomerNotInitialized",e[e.PaymentNotInitialized=2]="PaymentNotInitialized",e[e.ShippingNotInitialized=3]="ShippingNotInitialized",e[e.SpamProtectionNotInitialized=4]="SpamProtectionNotInitialized"}(S||(S={}));const L=function(e){function t(t){var n=e.call(this,function(e){switch(e){case S.CustomerNotInitialized:return"Unable to proceed because the customer step of checkout has not been initialized.";case S.PaymentNotInitialized:return"Unable to proceed because the payment step of checkout has not been initialized.";case S.ShippingNotInitialized:return"Unable to proceed because the shipping step of checkout has not been initialized.";case S.SpamProtectionNotInitialized:return"Unable to proceed because the checkout spam protection has not been initialized.";default:return"Unable to proceed because the required component has not been initialized."}}(t))||this;return n.subtype=t,n.name="NotInitializedError",n.type="not_initialized",n}return(0,n.__extends)(t,e),t}(o),P=function(){function e(e,t){this._host=e,this._hostedFormFactory=t}return e.prototype.initialize=function(e){var t=this,n=this._hostedFormFactory.create(this._host,e);return n.attach().then((function(){t._hostedForm=n}))},e.prototype.deinitialize=function(){this._hostedForm&&(this._hostedForm.detach(),this._hostedForm=void 0)},e.prototype.submitManualOrderPayment=function(e){return(0,n.__awaiter)(this,void 0,void 0,(function(){var t;return(0,n.__generator)(this,(function(n){switch(n.label){case 0:if(!(t=this._hostedForm))throw new L(S.PaymentNotInitialized);return[4,t.validate()];case 1:return n.sent(),[4,t.submitManualOrderPayment({data:e})];case 2:return n.sent(),[2]}}))}))},e}();function F(e){return new P(e,new I)}module.exports=t})();
//# sourceMappingURL=hosted-form-v2-iframe-host.js.map