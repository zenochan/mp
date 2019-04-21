import {Pipes} from "./pipes";

Component({
  properties: {
    value: {
      type: Array, value: [], observer: function (arrays: any[]) {
        try {
          let val = arrays[0];
          if (!arrays[1]) {
            this.setData({text: val});
            return;
          }

          let arr = arrays[1].split("|");
          arr.forEach(pipe => {
            let pipeArr = pipe.split(":");
            let method = pipeArr.shift();
            if (Pipes[method]) {
              val = Pipes[method](val, ...pipeArr);
            }
          });
          this.setData({text: val});
        } catch (e) {
          console.error(e)
        }
      }
    },

    equal: {
      type: null,
      value: null
    }
  }
});

