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
        if (newVal == 'today') {
          this.data.datetimeStart = new Date().format('yyyy-MM-dd HH:mm')
        }
        this.data.multiIndex = null;
        this.initDatetime();
      }
    },
    datetimeEnd: {
      type: String, value: null, observer(newVal, oldVal)
      {
        if (newVal == 'today') {
          this.data.datetimeEnd = new Date().format('yyyy-MM-dd HH:mm')
        }
        this.data.multiIndex = null;
        this.initDatetime();
      }
    },


    region: {
      type: Boolean, value: false, observer(newVal, oldVal)
      {
        this.setData({mode: 'region'});
      }
    },


    dateStart: {
      type: String, value: "", observer(newVal)
      {
        if (newVal == 'today') {
          this.data.dateStart = new Date().format('yyyy-MM-dd')
        }
      }
    },
    dateEnd: {
      type: String, value: "", observer(newVal)
      {
        if (newVal == 'today') {
          this.data.dateEnd = new Date().format('yyyy-MM-dd')
        }
      }
    },
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
      let years = [];
      let months = [];
      let days = [];
      let hours = [];
      let minutes = [];


      let today = new Date();
      let now = today.format("yyyy:MM:dd:HH:mm").split(":").map(item => parseInt(item));
      let start = this.data.datetimeStart.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(item => parseInt(item));
      let end = null;
      if (this.data.datetimeEnd) {
        end = this.data.datetimeEnd.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(item => parseInt(item));
      }

      years = stringArray(start[0], end ? end[0] : today.getFullYear() + 5);

      let {choose_year, choose_month, choose_day, choose_h, choose_m} = this.data;
      choose_year = choose_year || (end || start || now)[0];
      choose_month = choose_month || (end || start || now)[1];
      choose_day = choose_day || (end || start || now)[2];
      choose_h = choose_h || (end || start || now)[3];
      choose_m = choose_m || (end || start || now)[4];

      let monthStart = 1;
      let monthEnd = 12;

      if (start && choose_year == start[0]) {
        monthStart = start[1]
      }
      if (end && choose_year == end[0]) {
        monthEnd = end[1]
      }
      months = stringArray(monthStart, monthEnd);

      let dayStart = 1;
      let dayEnd = 31;
      if (start && choose_year == start[0] && choose_month == start[1]) {
        dayStart = start[2]
      }

      if (end && choose_year == end[0] && choose_month == end[1]) {
        dayEnd = end[2]
      }


      days = monthDays(choose_year, choose_month, dayStart, dayEnd);


      let hStart = 0;
      let hEnd = 23;
      if (start && choose_year == start[0] && choose_month == start[1] && choose_day == start[2]) {
        hStart = start[3]
      }
      if (end && choose_year == end[0] && choose_month == end[1] && choose_day == end[2]) {
        hEnd = end[3]
      }

      hours = stringArray(hStart, hEnd);


      let mStart = 0;
      let mEnd = 59;
      if (start && choose_year == start[0] && choose_month == start[1] && choose_day == start[2] && choose_h == start[3]) {
        mStart = start[4]
      }
      if (end && choose_year == end[0] && choose_month == end[1] && choose_day == end[2] && choose_h == end[3]) {
        mEnd = end[4]
      }

      minutes = stringArray(mStart, mEnd);

      let multiArray = [years, months, days, hours, minutes];
      let multiIndex = this.data.multiIndex;
      if (!multiIndex) {
        let n = today.format('yyyy:MM:dd:HH:mm').split(':');
        multiIndex = [
          multiArray[0].indexOf(n[0]),
          multiArray[1].indexOf(n[1]),
          multiArray[2].indexOf(n[2]),
          multiArray[3].indexOf(n[3]),
          multiArray[4].indexOf(n[4]),
        ];
      }

      for (let i = 0; i < multiIndex.length; i++) {
        // index 修正
        multiIndex[i] = Math.min(multiIndex[i], multiArray[i].length - 1);
        multiIndex[i] = Math.max(multiIndex[i], 0);
      }


      this.setData({multiArray, multiIndex});
    },

    onColumnChange(e: WXEvent)
    {
      if (this.data.datetime) {
        let key = ['choose_year', 'choose_month', 'choose_day', 'choose_h', 'choose_m'];
        let {column, value} = e.detail;
        let data: any = {};
        data[key[column]] = this.data.multiArray[column][value];
        this.setData(data);

        this.data.multiIndex[column] = value;
        this.initDatetime();
      }
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
