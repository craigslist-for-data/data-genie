function stringify(value){
  if(Boolean(value)){
    return `'${value}'`
  } else {
    return null
  }
}

module.exports = {
  stringify,
}
