import {Pipes} from "./Pipes";

Component({
  properties: {
    value: {
      type: Array, value: [], observer: function (arrays: any[]) {
        try {
          let val = arrays[0];
          if (!val) {
            this.setData({text: ''});
            return;
          }

          if (!arrays[1]) {
            this.setData({text: val});
            return;
          }

          let arr = arrays[1].split("||");
          arr.forEach(pipe => {
            let pipeArr = pipe.split("|");
            let method = pipeArr.shift();
            if (Pipes[method]) {
              val = Pipes[method](val, ...pipeArr);
            }
          });
          this.setData({text: val});
        } catch (e) {
          console.error("PIPE", arrays, e);
          this.setData({text: ''});
        }
      }
    },

    equal: {
      type: null,
      value: null
    }
  },
});

