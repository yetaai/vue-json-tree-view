<template>
  <div class="tree-view-wrapper">
    <tree-view-item class="tree-view-item-root" :data="parsedData" :max-depth="allOptions.maxDepth" :current-depth="0" :modifiable="allOptions.modifiable" :link="allOptions.link" @change-data="onChangeData"></tree-view-item>
  </div>
</template>

<script>
//  import _ from 'lodash'
  import TreeViewItem from './TreeViewItem.vue'

  export default {
    components:{
      TreeViewItem
    },
  	name: "tree-view",
    props: ["data", "options"],
    methods: {

    	// Transformer for the non-Collection types,
      // like String, Integer of Float
      transformValue: function(valueToTransform, keyForValue){
      	return {
        	key: keyForValue,
          type: "value",
          value: valueToTransform
        }
      },

      generateChildrenFromCollection: function(collection) {
        return Object.keys(collection).map(keyOrIndex => {
          let value = collection[keyOrIndex]
          if (this.isObject(value)) {
            return this.transformObject(value, keyOrIndex);
          }
          if (this.isArray(value)) {
            return this.transformArray(value, keyOrIndex);
          }
          if (this.isValue(value)) {
            return this.transformValue(value, keyOrIndex);
          }
        })
      },

    	// Transformer for the Array type
      transformArray: function(arrayToTransform, keyForArray){
      	return {
        	key: keyForArray,
          type: "array",
          children: this.generateChildrenFromCollection(arrayToTransform)
        }
      },

      // Transformer for the Object type
    	transformObject: function(objectToTransform, keyForObject, isRootObject = false){
        return {
        	key: keyForObject,
        	type: "object",
          isRoot: isRootObject,
          children: this.generateChildrenFromCollection(objectToTransform)
        }
      },

      // Helper Methods for value type detection
      isObject: function(value){
//      	return _.isPlainObject(value);
        return typeof value === 'object' && !Array.isArray(value)
      },

      isArray: function(value){
//      	return _.isArray(value);
        return Array.isArray(value)
      },

      isValue: function(value){
      	return !this.isObject(value) && !this.isArray(value);
      },

      onChangeData: function(path, value) {
        let clone = function (obj) {
          if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

          if (obj instanceof Date)
            var temp = new obj.constructor(); //or new Date(obj);
          else
            var temp = obj.constructor();

          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              obj['isActiveClone'] = null;
              temp[key] = clone(obj[key]);
              delete obj['isActiveClone'];
            }
          }
          return temp;
        }
//        -----------path of original in onChangeData type: object build.js:19604:7
//        -----------path of original in onChangeData: ["root","testArray",1]
        //        let pathKeys = Object.keys[path]
        let lastKey = path[path.length - 1]
        path = path.slice(1, path.length - 1)
        let data = clone(this.data)
        let targetObject = data
        path.forEach((key) => {
          targetObject = targetObject[key]
        })
//        let lastKey = _.last(path)
//        path = _.dropRight(_.drop(path))
//
//        let data = _.cloneDeep(this.data)
//        let targetObject = data
//        _.forEach(path, (key) => {
//          targetObject = targetObject[key]
//        })

        if (targetObject[lastKey] != value) {
          targetObject[lastKey] = value
          this.$emit('change-data', data)
        }
      },
    },
    computed: {
      allOptions: function(){
        return Object.assign({}, {
          rootObjectKey:  "root",
          maxDepth:       4,
          modifiable:     false,
          link: false
        }, (this.options || {}) )
      },
    	parsedData: function(){
      	// Take the JSON data and transform
        // it into the Tree View DSL

        // Strings or Integers should not be attempted to be split, so we generate
        // a new object with the string/number as the value
        if (this.isValue(this.data)) {
          return this.transformValue(this.data, this.allOptions.rootObjectKey);
        }

        // If it's an object or an array, transform as an object
        return this.transformObject(this.data, this.allOptions.rootObjectKey, true);
      }
    }
  };
</script>

<style scoped>

.tree-view-wrapper {
  overflow: auto;
}

/* Find the first nested node and override the indentation */
.tree-view-item-root > .tree-view-item-leaf > .tree-view-item {
  margin-left: 0!important;
}

/* Root node should not be indented */
.tree-view-item-root {
  margin-left: 0!important;
}

</style>
