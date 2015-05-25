import Ember from "ember";

var paginationView = Ember.View.extend({
    tagName: 'div',
    classNames: [],
    attributeBindings: ['style'],
    style: 'position:fixed; bottom:0px;left:50%;margin-left:-150px;z-index:7',
    layoutName: 'components/ui-pagination',
});


Ember.Handlebars.helper('ui-pagination', paginationView);

export default paginationView;

