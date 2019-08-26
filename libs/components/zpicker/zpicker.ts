/**
 * # Event
 * bind:change
 *
 * # properties
 * range: String[] | Object[]
 * value: String | Object
 */
Component({
  data: {
    range: [],
    rangekey: '',
    value: null,
    mode: 'selector',
    // mode = date
    dateStart: '',// yyyy-MM-dd
    dateFields: 'day',
    dateEnd: '',// yyyy-MM-dd
  },

  externalClasses: ["zclass"],

  properties: {
    range: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        let first = newVal[0];

        if (!this.data.rangekey && first && typeof first == 'object') {
          Object.keys(first).forEach(key => {
            if (first.hasOwnProperty(key) && typeof first[key] == 'string') {
              this.setData({rangekey: key});
            }
          });
        }
      }
    },

    rangekey: {type: String, value: ''},
    disabled: {type: Boolean, value: false},
    value: {type: null, value: null,},
    placeholder: {type: String, value: '请选择'},

    date: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.setData({mode: 'date'});
      }
    },

    region: {
      type: Boolean, value: false, observer(newVal, oldVal)
      {
        this.setData({mode: 'region'});
      }
    },


    dateStart: {type: String, value: ""},
    dateEnd: {type: String, value: ""},
    dateFields: {type: String, value: "day"}
  },

  methods: {
    onChange(event: WXEvent)
    {
      let value = this.data.range[event.detail.value] || event.detail.value;
      this.triggerEvent('change', {value});
    }
  },

  ready()
  {
  }
});


