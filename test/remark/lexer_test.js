var Lexer = require('../../src/remark/lexer');

describe('Lexer', function () {

  describe('identifying tokens', function () {
    it('should recognize text', function () {
      lexer.lex('1').should.eql([
        {type: 'text', text: '1'}
      ]);
    });

    it('should treat empty source as empty text token', function () {
      lexer.lex('').should.eql([
        {type: 'text', text: ''}
      ]);
    });

    it('should recognize normal separator', function () {
      lexer.lex('\n---\n').should.eql([
        {type: 'separator', text: '---'}
      ]);
    });

    it('should recognize continued separators', function () {
      lexer.lex('\n--\n').should.eql([
        {type: 'separator', text: '--'}
      ]);
    });

    it('should recognize code', function () {
      lexer.lex('    code').should.eql([
        {type: 'code', text: '    code'}
      ]);
    });

    it('should recognize fences', function () {
      lexer.lex('```\ncode```').should.eql([
        {type: 'fences', text: '```\ncode```'}
      ]);
    });
    
    it('should recognize content class', function () {
      lexer.lex('.class[content]').should.eql([
        {type: 'content_start', 'class': 'class'},
        {type: 'text', text: 'content'},
        {type: 'content_end'}
      ]);
    });

    it('should treat unclosed content class as text', function () {
      lexer.lex('.class[content').should.eql([
        {type: 'text', text: '.class[content'}
      ]);
    });

    it('should leave separator inside fences as-is', function () {
      lexer.lex('```\n---\n```').should.eql([
        {type: 'fences', text: '```\n---\n```'}
      ]);
    });

    it('should leave separator inside content class as-is', function () {
      lexer.lex('.class[\n---\n]').should.eql([
        {type: 'content_start', 'class': 'class'}, 
        {type: 'text', text: '\n---\n'},
        {type: 'content_end'}
      ]);
    });

    it('should leave content class inside code as-is', function () {
      lexer.lex('    .class[x]').should.eql([
        {type: 'code', text: '    .class[x]'}
      ]);
    });

    it('should leave content class inside fences as-is', function () {
      lexer.lex('```\n.class[x]\n```').should.eql([
        {type: 'fences', text: '```\n.class[x]\n```'}
      ]);
    });
    
    it('should lex content classes recursively', function () {
      lexer.lex('.c1[.c2[x]]').should.eql([
        {type: 'content_start', 'class': 'c1'},
        {type: 'content_start', 'class': 'c2'},
        {type: 'text', text: 'x'},
        {type: 'content_end'},
        {type: 'content_end'}
      ]);
    });
  });

  var lexer;

  beforeEach(function () {
    lexer = new Lexer();
  });

});
