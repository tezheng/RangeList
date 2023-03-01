
# RangeList

[![Test CI](https://github.com/tezheng/RangeList/actions/workflows/test.ci.js.yml/badge.svg)](https://github.com/tezheng/RangeList/actions/workflows/test.ci.js.yml)

## Prerequests


```
"node": "^14.15 || ^16.13 || ^18.14"
"packageManager": "npm@9.5.0"
```

## Usage

``` javascript
import { RangeList } from '@zhengt/rangelist';

const rl = new RangeList();
rl.add([1, 5])
rl.add([10, 19])
rl.add([20, 30])
rl.remove([16, 18])

// The output will be [1, 5) [10, 16) [18, 19) [20, 30)
console.log(rl.toString());

```

## Test

``` bash
npm install
npm test
```

## License

MIT
