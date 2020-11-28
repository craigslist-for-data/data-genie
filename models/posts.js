const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storePost(postContents) {
  try{
    const { accountId, topic, usage, purpose, briefDesc, detailedDesc, links } = postContents
    const query = `INSERT INTO posts
                    (account_id, topic, usage, purpose, brief_description, detailed_description, links)
                  VALUES
                    (${accountId},
                    ${stringifyForPGInsert(topic)},
                    '${usage}',
                    ${stringifyForPGInsert(purpose)},
                    ${stringifyForPGInsert(briefDesc)},
                    ${stringifyForPGInsert(detailedDesc)},
                    ${stringifyForPGInsert(links)})
                  RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    throw new Error(err)
  }
}

async function getPost(id) {
  const query = `SELECT * FROM posts WHERE id = ${id}`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

async function getPostsBatch(index, batchSize) {
  const query = `SELECT * FROM
                  (SELECT *, CAST(row_number() over (ORDER BY created_at desc) as int) as row FROM posts) as tt
                WHERE (row - 1)  / ${batchSize} >= ${index - 1} AND (row - 1)  / ${batchSize} < ${index}`
  return pool
          .query(query)
          .then(res => res.rows)
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

module.exports = {
  storePost,
  getPost,
  getPostsBatch,
}
