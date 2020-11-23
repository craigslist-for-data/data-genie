function stringifyForPGInsert(value){
  try {
    if(Boolean(value)){
      const cleanedString = String(value).replace("'","''")
      const stringified = `\'${cleanedString}\'`
      // console.log('Cleaned: ', cleanedString)
      // console.log('Stringified: ', stringified)
      // return cleanedString
      // const query1 = `insert here ${cleanedString}`
      // const query2 = `insert here ${stringified}`
      // console.log({"cleaned":cleanedString,
      //         "cleanedQuery":query1,
      //         "stringified":stringified,
      //         "stringifiedQuery":query2})
      return stringified
    } else {
      return null
    }
  } catch (err) {
      console.error(err)
      return null
  }
}

module.exports = {
  stringifyForPGInsert,
}
