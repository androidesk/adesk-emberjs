var FormMixin = Ember.Mixin.create({
    isSaving: false,
    isSuccess: false,
    isError: false,
    actions: {
        saveForm: function(record) {
            var $this = this;
            console.log($this.modelName);
            this.store.save($this.modelName, record).then(function(data) {
                var error = '你的网络有问题或网站的服务出了问题';
                if (data.code === 0) {
                    $this.toggleProperty('isSuccess');
                    $this.set('msg', '修改成功');
                    $this.toggleProperty('isEditMode');
                } else {
                    $this.toggleProperty('isError');
                    $this.set('msg', data.msg || error);
                }
            }, function(reason) {
                $this.toggleProperty('isError');
                $this.set('msg', error);
            });
        },
        createForm: function() {
            this.toggleProperty('isCreateMode');
        },
        edit: function() {
            this.toggleProperty('isEditMode');
        }
    },
    isSuccessObserver: Ember.immediateObserver('isSuccess', function() {
        if (this.get('isSuccess')) {
            this.set('isError', false);
            this.set('isSaving', false);
        }
    }),
    isErrorObserver: Ember.immediateObserver('isError', function() {
        if (this.get('isError')) {
            this.set('isSuccess', false);
            this.set('isSaving', false);
        }
    }),
    isSavingObserver: Ember.immediateObserver('isSaving', function() {
        if (this.get('isSaving')) {
            this.set('isSuccess', false);
            this.set('isError', false);
        }
    }),
    isTip: function() {
        return this.get('isSuccess') || this.get('isError');
    }.property('isSuccess', 'isError'),
    isEditMode: false,
    isEditModeObserver: Ember.immediateObserver('isEditMode', function() {
        this.set('isSaving', false);
        this.set('isError', false);
        this.set('isSuccess', false);
        this.set('isCreateMode', false);
        var modal = '#' + this.get('_id');
        if (this.get('isEditMode')) {
            Ember.$(modal).modal('show');
        } else {
            Ember.$(modal).modal('hide');
        }
    }),
    isCreateMode: false,
    isCreateModeObserver: Ember.immediateObserver('isCreateMode', function() {
        this.set('isSaving', false);
        this.set('isError', false);
        this.set('isSuccess', false);
        this.set('isEditMode', false);
        var modal = "#newForm"
        if (this.get('isCreateMode')) {
            Ember.$(modal).modal('show');
        } else {
            Ember.$(modal).modal('hide');
        }
    }),
    msg: '',
});


Ember.FormController = Ember.ObjectController.extend(FormMixin);