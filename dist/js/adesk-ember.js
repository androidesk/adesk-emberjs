Ember.TEMPLATES["adesk/js/templates/components/ui-message-view"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<p>");
  stack1 = helpers._triageMustache.call(depth0, "msg", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\n");
  return buffer;
  
});

Ember.TEMPLATES["adesk/js/templates/components/ui-pagination-view"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"ui left labeled icon button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "prevPage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" >\n  <i class=\"left arrow icon\"></i>\n  prev page\n</div>\n\n<div class=\"ui right labeled icon button\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "nextPage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" >\n  <i class=\"right arrow icon\"></i>\n  next page\n</div>");
  return buffer;
  
});;Ember.ButtonView = Ember.View.extend({
    tagName: 'button',
    classNames: ['ui', 'button', 'small'],
    classNameBindings: ['isLoading:loading'],
    isLoading: false,
    isLoadingBinding: 'controller.isSaving',
    attributeBindings: ['style'],
    style: '',
});;Ember.MessageView = Ember.View.extend({
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
});;Ember.PaginationView = Ember.View.extend({
    tagName: 'div',
    classNames: [],
    attributeBindings: ['style'],
    style: 'position:fixed; bottom:0px;left:50%;margin-left:-150px;z-index:7',
    layoutName: 'components/ui-pagination-view',
});;var FormMixin = Ember.Mixin.create({
    isSaving: false,
    isSuccess: false,
    isError: false,
    actions: {
        saveForm: function(modelName, record) {
            var $this = this;
            this.store.find(modelName).save(record).then(function(data) {
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


Ember.FormObject = Ember.ObjectController.extend(FormMixin);;var paginationControllerMixin = Ember.Mixin.create({
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


var paginationMixinRoute = Ember.Mixin.create({
    queryParams: {
        skip: {
            refreshModel: true
        }
    }
});


Ember.ArrayController = Ember.ArrayController.extend(paginationControllerMixin);

Ember.Route = Ember.Route.extend(paginationMixinRoute);;Ember.Model = Ember.Object.extend(Ember.Evented, {
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
        if (model[primaryKey]) {
            record[primaryKey] = model[primaryKey];
        }

        return Ember.$.post(this.get('api'), record, function() {}, "json").then(function(data) {
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
            url: $this.get('api'),
            data: {
                '_id': model[_id]
            },
            dataType: 'json'
        }).then(function(data) {
            return data;
        });
    },
    find: function(params) {
        var $this = this;
        params = $this._filterParams(params);
        return Ember.$.getJSON(this.get('api'), params || {}).then(function(data) {
            return data.res[$this.get('rootKey')];
        });
    },
    findOne: function(id) {
        return Ember.$.getJSON(this.get('api') + '/' + id).then(function(data) {
            return data.res[$this.get('rootKey')];
        });
    },
    _filterParams: function() {
        if (!params) return;
        for (var k in params) {
            if (params.hasOwnProperty(k) && !params[k]) {
                delete params[k];
            }
        }
        return params;
    }
});


Ember.Store = Ember.Object.extend({
    modelFor: function(type) {
        return this.container.lookupFactory('model:' + type);
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
    }
});

Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
        name: "store",
        initialize: function(container, application) {
            application.register('store:main', container.lookupFactory('store:application') || Ember.Store);
            application.inject('route', 'store', 'store:main');
            application.inject('controller', 'store', 'store:main');
        }
    });
});