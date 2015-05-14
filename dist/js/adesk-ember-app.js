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

Ember.Handlebars.helper('ui-button', buttonView);var messageView = Ember.View.extend({
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
    layoutName: 'components/ui-message-view',
});


Ember.Handlebars.helper('ui-message', messageView);var paginationView = Ember.View.extend({
    tagName: 'div',
    classNames: [],
    attributeBindings: ['style'],
    style: 'position:fixed; bottom:0px;left:50%;margin-left:-150px;z-index:7',
    layoutName: 'components/ui-pagination-view',
});


Ember.Handlebars.helper('ui-pagination', paginationView);var FormMixin = Ember.Mixin.create({
    isSaving: false,
    isSuccess: false,
    isError: false,
    needs: ['application'],
    application: function(){
        return this.get('controllers.application');
    }.property(),
    actions: {
        saveForm: function(record) {
            var $this = this;
            var error = '你的网络有问题或网站的服务出了问题';
            this.store.save($this.modelName, record).then(function(data) {
                if (data.code === 0) {
                    $this.toggleProperty('isSuccess');
                    $this.set('msg', '修改成功');
                    $this.send('_actionEdit', false);
                    $this.send('_actionCreate', false);
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
            this.send('_actionCreate', true);
        },
        edit: function() {
            this.send('_actionEdit', true);
        },
        create: function() {
            this.set('model', this.store.createRecord(this.modelName));
            this.send('createForm');
        },
        delete: function() {
            var $this = this;
            this.store.deleteRecord($this.modelName, $this.get('model')).then(function(data) {
                if (data.code === 0) {
                    $this.get('parentController').get("content").removeObject($this.get('model'));
                }
            });
        },
        _actionCreate: function(status) {
            this.set('isSaving', false);
            this.set('isError', false);
            this.set('isSuccess', false);
            this.set('isEditMode', false);
            var modal = "#"+this.get('formModalId');
            if (status) {
                Ember.$(modal).modal('show');
            } else {
                Ember.$(modal).modal('hide');
            }
        },
        _actionEdit: function(status) {
            this.set('isSaving', false);
            this.set('isError', false);
            this.set('isSuccess', false);
            this.set('isCreateMode', false);
            var modal = '#' + this.get('_id');
            if (status) {
                Ember.$(modal).modal('show');
            } else {
                Ember.$(modal).modal('hide');
            }
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
    formModalId: function(){
        return 'form-'+this.modelName;
    }.property(),
    isTip: function() {
        return this.get('isSuccess') || this.get('isError');
    }.property('isSuccess', 'isError'),
    isEditMode: false,
    isCreateMode: false,
    isEditModeObserver: Ember.immediateObserver('isEditMode', function() {
        this.send('_actionEdit', this.get('isEditMode'));
    }),
    isCreateModeObserver: Ember.immediateObserver('isCreateMode', function() {
        this.send('_actionCreate', this.get('isCreateMode'));
    }),
    msg: '',
});


Ember.FormController = Ember.ObjectController.extend(FormMixin);var paginationController = Ember.Mixin.create({
    queryParams: ['skip'],
    skip: 0,
    limit: 20,
    actions: {
        prevPage: function() {
            var prevSkip = this.skip - this.limit;
            if (prevSkip < 0) {
                prevSkip = 0;
            }
            this.set('skip', prevSkip);
            this.transitionToRoute({
                queryParams: {
                    skip: prevSkip
                }
            });
        },
        nextPage: function() {
            var nextSkip = this.skip + this.limit;
            // if have next page
            if (this.get('model').length % this.limit !== 0) {
                return;
            }

            this.transitionToRoute({
                queryParams: {
                    skip: nextSkip
                }
            });
        }
    }
});


var paginationRoute = Ember.Mixin.create({
    queryParams: {
        skip: {
            refreshModel: true
        }
    }
});


/*Ember.ArrayController = Ember.ArrayController.extend(paginationMixin);
Ember.Route = Ember.Route.extend(paginationMixinRoute);*/Ember.Model = Ember.Object.extend(Ember.Evented, {
    rootURL: '',
    rootKey: '',
    url: '',
    primaryKey: '_id',
    api: function() {
        return this.rootURL + this.url;
    }.property('url'),
    save: function(model) {
        var $this = this;
        var primaryKey = this.get('primaryKey')
        var record = {};

        //filter model data
        Ember.$.each(Ember.keys(model), function(index, key) {
            if ($this.model.hasOwnProperty(key)) {
                record[key] = model[key];
            }
        });

        //check if is new data
        var url = this.get('api');
        var method = 'post';
        if (model[primaryKey]) {
            record[primaryKey] = model[primaryKey];
            url = this.get('api') + '/' + model[primaryKey];
            method = 'put'
        }

        return Ember.$.ajax({
            type: method,
            url: url,
            data: record,
            dataType: 'json',
            traditional: true
        }).then(function(data) {
            return data;
        });
    },
    createRecord: function() {
        return Ember.Object.create(this.model);
    },
    deleteRecord: function(model) {
        var $this = this;
        var _id = $this.get('primaryKey');
        return Ember.$.ajax({
            type: 'delete',
            url: $this.get('api') + '/' + model.get(_id),
            dataType: 'json'
        }).then(function(data) {
            return data;
        });
    },
    find: function(params) {
        var $this = this;
        params = $this._filterParams(params);
        return Ember.$.getJSON(this.get('api'), params || {}).then(function(data) {
            var dataList = [];
            Ember.$.each(data.res[$this.get('rootKey')], function(index, i) {
                dataList.push(Ember.Object.create(i));
            });
            return dataList;
        });
    },
    findOne: function(id) {
        return Ember.$.getJSON(this.get('api') + '/' + id).then(function(data) {
            return Ember.Object.create(data.res[$this.get('rootKey')]);
        });
    },
    _filterParams: function(params) {
        if (!params) return;
        for (var k in params) {
            if (params.hasOwnProperty(k) && !params[k]) {
                delete params[k];
            }
        }
        return params;
    }
});


Ember.Model.Store = Ember.Object.extend({
    modelFor: function(type) {
        var klass = this.container.lookupFactory('model:' + type);
        return klass.create();
    },
    find: function(type, params) {
        return this.modelFor(type).find(params);
    },
    findOne: function(type, _id) {
        return this.modelFor(type).findOne(_id);
    },
    createRecord: function(type) {
        return this.modelFor(type).createRecord();
    },
    deleteRecord: function(type, model) {
        return this.modelFor(type).deleteRecord(model);
    },
    save: function(type, model) {
        return this.modelFor(type).save(model);
    },
    emptyAttrs: function(type, model, filterKeys, unfilterKeys) {
        var emptyKeys = [];
        var filtered = filterKeys || Ember.keys(this.modelFor(type).model);
        var unfiltered = unfilterKeys || [];
        
        var finallyfiltered = filtered.filter(function(item, index){
            return unfiltered.indexOf(item) === -1;
        });

        Ember.$.each(finallyfiltered, function(index, key) {
            if (typeof key === "string") {
                if (Ember.isEmpty(model.get(key))) {
                    emptyKeys.push(key);
                }
            }
        });
        return emptyKeys;
    }
});

Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
        name: "store",
        initialize: function(container, application) {
            application.register('store:main', container.lookupFactory('store:application') || Ember.Model.Store);
            application.inject('route', 'store', 'store:main');
            application.inject('controller', 'store', 'store:main');
        }
    });
});