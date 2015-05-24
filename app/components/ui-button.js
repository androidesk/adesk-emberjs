var buttonView = Ember.View.extend({
    didInsertElement: function() {
        //pass
    },
    tagName: 'button',
    classNames: ['ui', 'button', 'small'],
    classNameBindings: ['isLoading:loading'],
    isLoading: false,
    isLoadingBinding: 'controller.isSaving',
    attributeBindings: ['style'],
    style: '',
    layoutName: 'components/ui-button-view'
});

Ember.Handlebars.helper('ui-button', buttonView);