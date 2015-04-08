var buttonView = Ember.View.extend({
    didInsertElement: function() {
        this.$().html('save');
    },
    tagName: 'button',
    classNames: ['ui', 'button', 'small'],
    classNameBindings: ['isLoading:loading'],
    isLoading: false,
    isLoadingBinding: 'controller.isSaving',
    attributeBindings: ['style'],
    style: '',
});

Ember.Handlebars.helper('ui-button', buttonView);