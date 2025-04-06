import app from './app'
import {main} from './db'

const port = process.env.PORT || 5000
main()
.then(() => {
    console.log('connected to db');
    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })

})
.catch((err) => {
    console.log(err);
})
