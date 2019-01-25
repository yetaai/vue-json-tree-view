import TreeViewItemValue from './TreeViewItemValue.vue';
import TreeViewItem from './TreeViewItem.vue';
import TreeView from './TreeView.vue';

// module.exports = function install(Vue){
//     Vue.component("tree-view-item-value", TreeViewItemValue);
//     Vue.component("tree-view-item", TreeViewItem);
//     Vue.component("tree-view", TreeView);
// };
TreeView.install = function (Vue) {
  Vue.component('TreeView', TreeView)
}
TreeViewItem.install = function (Vue) {
  Vue.component('TreeViewItem', TreeViewItem)
}
TreeViewItemValue.install = function (Vue) {
  Vue.component('TreeViewItemValue', TreeViewItemValue)
}
export default {TreeView, TreeViewItem, TreeViewItemValue}
