const { mainPgPool } = require('../dbs/pg_helpers')
const { stringify } = require('../utilities')

async function createPost(postContents) {
  const { accountId, topic, usage, purpose, briefDesc, detailedDesc, links } = postContents
  query = `INSERT INTO posts
            (account_id, topic, usage, purpose, brief_description, detailed_description, links)
          VALUES
            (${accountId},
            '${topic}',
            '${usage}',
            '${purpose}',
            '${briefDesc}',
            '${detailedDesc}',
            ${stringify(links)})
          RETURNING id`
  const result = await mainPgPool.submitTransaction(query)
  return result.rows[0].id
}

async function getPost(id) {
  return mainPgPool.pool
          .query(`SELECT * FROM posts WHERE id = ${id}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

async function getPosts(index, batchSize) {
  return mainPgPool.pool
          .query(`
            SELECT * from (
              SELECT *, CAST(row_number() over (ORDER BY created_at desc) as int) as row FROM posts
            ) as tt
            WHERE (row - 1)  / ${batchSize} >= ${index - 1} AND (row - 1)  / ${batchSize} < ${index}
            `)
          .then(res => res.rows)
          .catch(err => console.error(err.stack))
}

module.exports = {
  createPost,
  getPost,
  getPosts,
}
