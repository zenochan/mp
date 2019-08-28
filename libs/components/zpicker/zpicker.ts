import '../../utils/extends.date';

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
    datetimeStart: '',// yyyy-MM-dd HH:mm:ss
    datetimeEnd: '',// yyyy-MM-dd HH:mm:ss
    multiIndex: [0, 0, 0, 0, 0]
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
    datetimeStart: {
      type: String, value: '2010-01-01 00:00', observer(newVal, oldVal)
      {
        this.initDatetime();
      }
    },
    datetimeEnd: {
      type: String, value: null, observer(newVal, oldVal)
      {
        if (newVal == 'today') {
          this.data.datetimeEnd = new Date().format('yyyy-MM-dd HH:mm')
        }
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
      console.error('itniDatetime');
      const date = new Date();
      let years = [];
      let months = [];
      let days = [];
      let hours = [];
      let minutes = [];


      let today = new Date();
      let start = this.data.datetimeStart.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(item => parseInt(item));
      let end = null;
      if (this.data.datetimeEnd) {
        end = this.data.datetimeEnd.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(item => parseInt(item));
      }

      years = stringArray(start[0], end ? end[0] : today.getFullYear() + 5);

      let {choose_year, choose_month, choose_day, choose_h, choose_m} = this.data;

      let monthStart = 1;
      let monthEnd = 12;

      if (choose_year == start[0]) {
        monthStart = start[1]
      } else if (choose_year == end[0]) {
        monthEnd = end[1]
      }
      months = stringArray(monthStart, monthEnd);

      let dayStart = 1;
      let dayEnd = 31;
      if (choose_year == start[0] && choose_month == start[1]) {
        dayStart = start[2]
      } else if (choose_year == end[0] && choose_month == end[1]) {
        dayEnd = end[2]
      }

      days = monthDays(choose_year, choose_month, dayStart, dayEnd);


      let hStart = 0;
      let hEnd = 23;
      if (choose_year == start[0] && choose_month == start[1] && choose_day == start[2]) {
        hStart = start[3]
      } else if (choose_year == end[0] && choose_month == end[1] && choose_day == end[2]) {
        hEnd = end[3]
      }

      hours = stringArray(hStart, hEnd);


      let mStart = 0;
      let mEnd = 59;
      if (choose_year == start[0] && choose_month == start[1] && choose_day == start[2] && choose_h == start[3]) {
        mStart = start[4]
      } else if (choose_year == end[0] && choose_month == end[1] && choose_day == end[2] && choose_h == end[3]) {
        mEnd = end[4]
      }

      minutes = stringArray(mStart, mEnd);

      let multiArray = [years, months, days, hours, minutes];
      let multiIndex = this.data.multiIndex;
      this.setData({multiArray,multiIndex});
    },

    onColumnChange(e: WXEvent)
    {
      let {choose_year, choose_month, choose_day, choose_h, choose_m} = this.data;

      if (this.data.datetime) {
        //获取年份
        if (e.detail.column == 0) {
          choose_year = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_year});
          this.initDatetime();
        }

        //获取月份
        if (e.detail.column == 1) {
          choose_month = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_month});
          this.initDatetime();
        }

        //获取日期
        if (e.detail.column == 2) {
          choose_day = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_day});
          this.initDatetime();
        }

        //获取h
        if (e.detail.column == 3) {
          choose_h = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_h});
          this.initDatetime();
        }


        //获取m
        if (e.detail.column == 4) {
          choose_m = this.data.multiArray[e.detail.column][e.detail.value];
          this.setData({choose_m});
          this.initDatetime();
        }


        this.data.multiIndex[e.detail.column] = e.detail.value;

        var data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex || [0, 0, 0, 0, 0]
        };

        data.multiIndex[0] = choose_month ? data.multiArray[0].indexOf(choose_year) : 0;
        data.multiIndex[1] = choose_month ? data.multiArray[1].indexOf(choose_month) : 0;

        // data.multiIndex[e.detail.column] = e.detail.value;
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

function monthDays(year: number, month: number, dayStart = 1, dayEnd = 31): number[]
{
  if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) { //判断31天的月份
    dayEnd = Math.min(dayEnd, 31);
  } else if (month == 4 || month == 6 || month == 9 || month == 11) { //判断30天的月份
    dayEnd = Math.min(dayEnd, 28);
  } else if (month == 2) { //判断2月份天数
    if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
      dayEnd = Math.min(dayEnd, 29);
    } else {
      dayEnd = Math.min(dayEnd, 28);
    }
  }

  return stringArray(dayStart, dayEnd);
}
