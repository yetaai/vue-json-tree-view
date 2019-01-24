-<template>
  <div>
    <span class="tree-view-item-key">{{keyString}}</span>
    <input v-if="modifiable" class="tree-view-item-value" :class="getValueType(data)" v-model="valueString" @keyup.enter="onUpdateData" @blur="onUpdateData">
    <span v-else class="tree-view-item-value" :class="getValueType(data)" v-html="valueFormed"></span>
    <span v-show="error">{{ error }}</span>
  </div>
</template>


<script>
export default {
    name: 'tree-view-item',
    props: ['data', 'modifiable', 'key-string', 'link'],
  data: function(){
  	return {
  		valueString: this.data && this.data.toString(),
      error: false,
  	}
  },
  computed: {
    valueFormed: function () {
      return this.getValue(this.data)
    }
  },
  watch: {
    valueFormed: function (val) {
      this.$set(this, 'valueString', typeof val === 'string' ? val.replace(/^["]+|["]+$/g, '') : val)
    }
  },
  methods: {
    onUpdateData: function() {
      try {
        let v = this.typedValue(this.valueString)
        this.error = false
        this.$emit('change-data', [], v)
      }
      catch (err) {
        this.error = err
      }
    },
    typedValue: function(v) {
      if (v == '') { throw 'empty' }

      let dataType = this.getValueType(this.data, '')

      switch (dataType) {
        case 'number':
          if (Number.isNaN(Number(v))) {
            throw 'only number'
          }
          return Number(v)
        case 'boolean':
          if (v.toLowerCase() === 'true') { return true }
          if (v.toLowerCase() === 'false') { return false }
          throw 'true or false'
        case 'string':
        default:
          return v
      }
    },
    getValue: function(value){
      if (!isNaN(value)) {
        return value
      }
      if (value === null || value === undefined) {
        return "null"
      }
      if (typeof value === 'string') {
        if (this.link && !this.modifiable) {
            return "\""+this.linkify(value)+"\"";
        }
        return "\""+value+"\"";
      }
      return value;
    },
    linkify(inputText) {
        // URLs starting with http://, https://, or ftp://
        const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        let replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
        // URLs starting with www. (without // before it, or it'd re-link the ones done above)
        const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
        // Change email addresses to mailto:: links
        const replacePattern3 = /([\w\.]+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
        return replacedText;
    },
    getValueType: function(value, prefix="tree-view-item-value-"){
      if (!isNaN(value)) {
        return prefix + "number"
      }
      if (typeof value === 'function') {
        return prefix + "function"
      }
      if (typeof value === 'boolean') {
        return prefix + "boolean"
      }
      if (value === null || value === undefined) {
        return prefix + "null"
      }
      if (typeof value === "string") {
        return prefix + "string";
      }
      return prefix + "unknown";
    }
  }
}
</script>