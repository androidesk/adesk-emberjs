import Ember from "ember";

var messageView = Ember.View.extend({
    tagName: 'div',
    classNames: ['ui', 'message'],
    classNameBindings: ['isSuccess:positive', 'isError:negative', 'isTip::hidden'],
    isSuccess: false,
    isSuccessBinding: 'controller.isSuccess',
    isError: false,
    isErrorBinding: 'controller.isError',
    isTip: false,
    isTipBinding: 'controller.isTip',
    attributeBindings: ['style'],
    style: '',
    layoutName: 'components/ui-message'
});


Ember.Handlebars.helper('ui-message', messageView);

export default messageView;