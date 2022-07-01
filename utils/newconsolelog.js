// customize console.log to report full depth of response
import util from 'util';

const origLog = console.log
export function newConsoleLog(...msgs) {
  for (let m of msgs) {
    if (typeof m !== 'string') {
      m = util.inspect(m, { showHidden: false, depth: null })
    }
    origLog(m)
  }
}
