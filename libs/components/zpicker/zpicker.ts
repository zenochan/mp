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

    datetime: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.setData({range: null, mode: 'multiSelector'});
        this.initDatetime();
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

      if (this.data.datetime) {
        const index = this.data.multiIndex;
        const year = this.data.multiArray[0][index[0]];
        const month = this.data.multiArray[1][index[1]];
        const day = this.data.multiArray[2][index[2]];
        const hour = this.data.multiArray[3][index[3]];
        const minute = this.data.multiArray[4][index[4]];
        value = `${year}-${month}-${day} ${hour}:${minute}`;
      }

      this.triggerEvent('change', {value});
    },

    initDatetime()
    {
      const date = new Date();
      let years = [];
      let months = [];
      let days = [];
      let hours = [];
      let minutes = [];


      let today = new Date();


      years = stringArray(today.getFullYear(), today.getFullYear() + 5);

      months = stringArray(1, 12);
      days = monthDays(today.getFullYear(), today.getMonth() + 1);
      hours = stringArray(0, 23);
      minutes = stringArray(0, 59);

      this.setData({
        multiArray: [years, months, days, hours, minutes],
        multiIndex: [0, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes()]
      });
    },

    onColumnChange(e: WXEvent)
    {
      if (this.data.datetime) {
        //获取年份
        if (e.detail.column == 0) {
          let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
          console.log(choose_year);
          this.setData({choose_year})
        }

        //获取月份
        if (e.detail.column == 1) {
          let choose_month = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_month})
        }

        if (e.detail.column <= 1) {
          let year = parseInt(this.data.choose_year);
          let month = this.data.choose_month;
          let days = monthDays(year, month);
          this.setData({['multiArray[2]']: days});
        }
        var data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        this.setData(data);

      }
      // let value = this.data.range[event.detail.value] || event.detail.value;
      // this.triggerEvent('change', {value, code: event.detail.code});
    },

  },

  ready()
  {
  }
});


function stringArray(from: number, to: number)
{
  let array = [];
  for (let i = from; i <= to; i++) {
    array.push((i >= 10 ? "" : '0') + i);
  }

  return array;
}

function monthDays(year: number, month: number): number[]
{
  if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) { //判断31天的月份
    return stringArray(1, 31);
  } else if (month == 4 || month == 6 || month == 9 || month == 11) { //判断30天的月份
    return stringArray(1, 30);
  } else if (month == 2) { //判断2月份天数
    if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
      return stringArray(1, 29);
    } else {
      return stringArray(1, 28);
    }
  }

}
