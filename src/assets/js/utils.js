Number.prototype.toFixed = function (n) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const number = this;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof (n) == 'undefined' || n == 0) {
    return (Math.round(number)).toString();
  }

  let result = number.toString();
  const arr = result.split('.');

  // 整数的情况
  if (arr.length < 2) {
    result += '.';
    for (let i = 0; i < n; i += 1) {
      result += '0';
    }
    return result;
  }

  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0';
    }
    return result;
  }
  result = integer + '.' + decimal.substr(0, n);
  const last = decimal.substr(n, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = (Math.round((parseFloat(result) * x)) + 1) / x;
    result = result.toFixed(n);
  }

  return result;
};

var format = {
  formatTime(time, type) {
    let year = time.getFullYear()
    let mouth = time.getMonth() + 1
    let date = time.getDate()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    if (mouth < 10) {
      mouth = '0' + mouth
    }
    if (date < 10) {
      date = '0' + date
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    if (type === 1) {
      return year + '/' + mouth + '/' + date + '  ' + hours + ':' + minutes + ':' + seconds
    } else if (type === 3) {
      return year + '-' + mouth + '-' + date
    } else if (type === 4) {
      return year + '-' + mouth + '-' + date + '  ' + hours + ':' + minutes + ':' + seconds
    } else {
      return hours + ':' + minutes + ':' + seconds
    }
  }
}

export default format