const {isNullOrUndefined} = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('node-uuid');
const { createEngine } = require('express-react-views');
const server = express();
server.use(bodyParser.json());
server.use(cors());

const sendUserError = (msg, res) => {
  res.status(422);
  res.json({ Error: msg });
  return;
};
let books = [];
const book = { 
    BOOK_ID:null,
    ISBN:null,
    SUBJECT:null,
    AUTHOR:null,
    TITLE:null,
    VOTES:{UP:0,DOWN:0}
   };
books.push(book);

server.get('/', (req, res) => {
    res.send('You Have Reached the API');
});

server.get('/API/Search/:filter/:query', (req, res) => {
    res.send('You Have Reached the API Search');
});

server.get('/API/Books', (req, res) => {
    res.json(books);
});

server.get('/API/Book/:id', (req, res) => {
    if (req.param.id !== undefined) {
        let _book = books.filter( book => book.BOOK_ID === req.param.id);
        if(_book.length !== 0) {
            _book[0].RESPONSE = ['Success','Book found!'];
            _book = _book[0];
        } else {
            _book = Object.create(book);
            _book[0].RESPONSE = ['Error','Book not found!'];
        }
        res.json(
            _book
        );
    } else {
        sendUserError('Error: Parameter Missing. Book Id required.',res);
    }    
});

server.post('/API/Book', (req, res) => {    
    let _book = Object.create(book);
    _book.BOOK_ID = uuid.v4();
        if(req.body.ISBN !== undefined) {
            _book.ISBN = req.body.ISBN;
        } else {
            return sendUserError('Error: Parameter Missing. ISBN required.', res);
        }
        if(req.body.AUTHOR !== undefined) {
            _book.AUTHOR = req.body.AUTHOR;
        } else {
            return sendUserError('Error: Parameter Missing. Author required.', res);
        }
        if(req.body.SUBJECT !== undefined) {
            _book.SUBJECT = req.body.SUBJECT;
        } else {
            return sendUserError('Error: Parameter Missing. Subject required.', res);
        }
        if(req.body.TITLE !== undefined) {
            _book.TITLE = req.body.TITLE;
        } else {
            return sendUserError('Error: Parameter Missing. Title required.', res);
        }
        _book.RESPONSE = ['Success','Book added!'];
        books.push(_book);
    res.json(
        _book
    );
});

server.put('/API/Book/:id', (req, res) => {
    if (req.param.id !== undefined) {
        let _book = books.filter( book => book.BOOK_ID === req.param.id);
        if(_book.length !== 0) {
            if(req.body.ISBN !== undefined) {
                _book.ISBN = req.body.ISBN;
            }
            if(req.body.AUTHOR !== undefined) {
                _book.AUTHOR = req.body.AUTHOR;
            }
            if(req.body.SUBJECT !== undefined) {
                _book.SUBJECT = req.body.SUBJECT;
            }
            if(req.body.TITLE !== undefined) {
                _book.TITLE = req.body.TITLE;
            }
            _book[0].RESPONSE = ['Success','Book update completed!'];
            _book = _book[0];
        } else {
            _book = Object.create(book);
            _book[0].RESPONSE = ['Error','Book could not be updated!'];
        }
        res.json(
            _book
        );
    } else {
        sendUserError('Error: Parameter Missing. Book Id required.');
    }
});

server.delete('/API/Book/:id', (req, res) => {
    if (req.param.id !== undefined) {
        let _book = books.filter( book => book.BOOK_ID === req.param.id);
        if(_book.length !== 0) {
            books = books.filter( book => book.BOOK_ID !== req.param.id);
            _book[0].RESPONSE = ['Success','Book removed!'];
            _book = _book[0];
        } else {
            _book = Object.create(book);
            _book[0].RESPONSE = ['Error','Book could not be removed!'];
        }
        res.json(
            _book
        );
    } else {
        sendUserError('Error: Parameter Missing. Book Id required.', res);
    }
});

server.post('/API/Vote', (req, res) => {
    if(req.body.BOOK_ID !== undefined) {
        let _book = books.filter( book => book.BOOK_ID === req.body.BOOK_ID);
        if(_book.length !== 0) {
            if(req.body.VOTE !== undefined) {                    
                if(req.body.VOTE === 'UP') {
                    _book[0].VOTES.UP++;
                    _book[0].RESPONSE = ['Success','You up voted a book!'];
                } else if ( req.body.VOTE === 'DOWN' ) {
                    _book[0].VOTES.DOWN++;
                    _book[0].RESPONSE = ['Success','You down voted a book!'];
                } else {
                    _book[0].RESPONSE = ['Success','Your vote did not count!'];
                }
            } else {
                return sendUserError('Error: Parameter Missing. Book Id required.', res);
            }
        } else {
            _book = Object.create(book);
            _book[0].RESPONSE = ['Error','Could not cast your vote!'];
        }
        res.json(
            _book
        );           
    } else {
        return sendUserError('Error: Parameter Missing. Book Id required.', res);
    }

});

        
server.listen(3333, err => {
    if (err) console.log(err);
    console.log(`server is listening on port 3333`);
});