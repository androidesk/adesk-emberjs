Ember.Model = Ember.Object.extend(Ember.Evented, {
    rootURL: '',
    rootKey: '',
    url: '',
    primaryKey: '_id',
    api: function() {
        return this.rootURL + this.url;
    }.property('url'),
    save: function() {
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