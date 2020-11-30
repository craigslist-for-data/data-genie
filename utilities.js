const bcrypt = require('bcrypt')

function hashPassword(plaintextPassword){
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(plaintextPassword, salt)
  return hash
}

function stringifyForPGInsert(value){
  try {
    if(Boolean(value)){
      const cleanedString = String(value).replace("'","''")
      const stringified = `\'${cleanedString}\'`
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
  hashPassword,
}
