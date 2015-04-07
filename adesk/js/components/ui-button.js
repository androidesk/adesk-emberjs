Ember.ButtonView = Ember.View.extend({
    tagName: 'button',
    classNames: ['ui', 'button', 'small'],
    classNameBindings: ['isLoading:loading'],
    isLoading: false,
    isLoadingBinding: 'controller.isSaving',
    attributeBindings: ['style'],
    style: '',
});