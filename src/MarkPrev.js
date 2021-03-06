import React, { Component } from 'react';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import StrikethroughIcon from '@material-ui/icons/FormatStrikethrough';
import QuoteIcon from '@material-ui/icons/FormatQuote';

import './App.css';
import marked from 'marked';
import purify from 'dompurify';
import ContentEditable from 'react-contenteditable';
import turndown from 'turndown';
import Mapping from './Mapping';
import Bold from './img/bold.svg';
import Italic from './img/italic.svg';
import Strikethrough from './img/strikethrough.svg';
import hljs from 'highlight.js';
// import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/github.css';
var turndownPluginGfm = require('turndown-plugin-gfm');

// hljs.configure({ useBR: true });

//to change from markdown to html
const turndownService = new turndown();
turndownService.use(turndownPluginGfm.gfm);
turndownService.addRule('div', {
  filter: 'div',
  replacement: function (content) {
    return '\n' + content
  }
});

var loadScript = function (src) {
  var tag = document.createElement('script');
  tag.async = false;
  tag.src = src;
  document.getElementById('root').appendChild(tag);
}
loadScript('https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js')

const placeholder =
  `# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
  
Inline code, \`<div></div>\`, between 2 back-ticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
## Emphasis
Emphasis, aka italics, with *asterisks* or _underscores_.
Strong emphasis, aka bold, with **asterisks** or __underscores__.
Combined emphasis with **asterisks and _underscores_**.
Strikethrough uses two tildes. ~~Scratch this.~~
- - - -

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

## Tables
Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

## Lists
- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

// calls edit buttons like bold and Italic
function editSelection(edit, callback) {
  // console.log(edit)
  // if (edit === 'quote') {
  //     document.execCommand('FormatBlock', false, '<blockquote>');

  // } else {
  //     document.execCommand(edit);
  // }
  document.execCommand(edit);
  callback();
}

// customize html output from markdown input
marked.setOptions({
  // sanitize: true,
  headerIds: false,
  breaks: true,
  gfm: true
});

// const renderer = new marked.Renderer();
// renderer.link = function (href, title, text) {
//     return `<a target="_blank" href="${href}">${text}` + '</a>';
// }

// Component body
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: marked(placeholder), //default loading doc
      blockquote: false
    }

  };


  // for when user is typing in the WYSIWYG previewer. We detect the return key and overide the default behavior of the browser to input a line break. 
  handleKeyPress = (keyPress) => {
    // alert(keyPress.keyCode)
    if (keyPress.keyCode === 13) {
      keyPress.preventDefault(); //UGGHHH!!!! I hate contenteditable 
      document.execCommand('insertLineBreak', false); //UGH!!! it took me days and 100s of line of code to find this!
    }
  };

  handlePaste = (event) => {
    // var clipboardData;
    event.stopPropagation();
    event.preventDefault();
    // clipboardData = event.clipboardData || window.clipboardData;
    // // pasteData = clipboardData.getData('text');

    // // alert('working')
    // // document.getElementById('preview').insertAdjacentHTML('beforeend', clipboardData.getData('text'))

    // if (!window.getSelection().isCollapsed) {

    //     document.designMode = 'on';

    //     editSelection('paste', () => {
    //         document.designMode = 'off';
    //         // document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
    //         // alert('working')
    //         document.getElementById('preview').insertAdjacentHTML('beforeend', clipboardData.getData('text'))

    //         this.setState({
    //             html: document.getElementById('preview').innerHTML
    //         });
    //     });
    // }

    // console.log(clipboardData.getData('text'))

    // for security reasons
    // this.setState({
    //     html: purify.sanitize(document.getElementById('preview').innerHTML, {
    //         ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'code', 'ul', 'li', 'strong', 'em', 'ol', 'br', 'div', 'b', 'table', 'thead', 'th', 'tbody', 'tr', 'td', 'img'],
    //         FORBID_TAGS: ['style'],
    //         FORBID_ATTR: ['style']
    //     }).replace(/ /g, '&nbsp;') //to preserve white space in conversion ,
    // });

  }

  handleHighlight = () => {
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
  };

  handlePreview = (event) => {
    this.setState({
      html: event.target.value
    }, () => {
      // alert('UGH!')
      document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
    });


  }

  handleEditor = (event) => {
    // console.log(event.target.value)
    // hljs.initHighlighting.called = false;
    // hljs.initHighlighting();

    this.setState({
      // html: marked(event.target.value).replace(/ /g, '&nbsp;'),
      html: marked(event.target.value),
    }, () => {
      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
    });

  }

  //logic for editing docs
  enableMode = (event) => {
    event.preventDefault();

    if (!window.getSelection().isCollapsed || true) {
      const editName = event.target.id;
      document.designMode = 'on';
      // console.log(event.target.id);
      editSelection(editName, () => {

        document.designMode = 'off';
        document.getElementById('editor').value = turndownService.turndown(document.getElementById('preview').innerHTML);
        this.setState({
          html: document.getElementById('preview').innerHTML
        }, () => {
          document.getElementById('preview').focus();
        });
      });
    }
  }

  // test = (event) => {
  //     console.log(event.target)
  // }

  componentDidMount() {



  }

  render() {

    window.onload = () => {
      this.handleHighlight();
    }

    return (
      <div className='window' onClick={this.test}  >
        <div className='app' >
          <div className='edit-holder'>
            <div className='toolbar-edit'>
              <p>Source</p>
            </div>

            <div className="edit-container">
              <textarea id="editor"
                defaultValue={placeholder}
                onChange={this.handleEditor}
              ></textarea>
            </div>

          </div>



          <div className='preview-holder'>
            <div className='toolbar'>

              <IconButton onClick={this.enableMode} aria-label="bold">
                <BoldIcon id='bold' />
              </IconButton>
              <IconButton onClick={this.enableMode} aria-label="italic">
                <ItalicIcon id='italic' />
              </IconButton>
              <IconButton onClick={this.enableMode} aria-label="strikethrough">
                <StrikethroughIcon id='strikethrough' />
              </IconButton>

              <p>Preview</p>
            </div>
            <div className='preview-container'>


              {/* <IconButton onClick={this.enableMode} aria-label="quote">
                            <QuoteIcon id='quote' />
                        </IconButton> */}

              {/* <button onClick={this.enableMode}><img id='bold' src={Bold} alt="bold" /></button>
                        <button onClick={this.enableMode}><img id='italic' src={Italic} alt="italic" /></button>
                        <button onClick={this.enableMode}><img id='strikethrough' src={Strikethrough} alt="strikethrough" /></button> */}

              <ContentEditable id='preview'
                html={this.state.html}
                onChange={this.handlePreview}
                onKeyDown={this.handleKeyPress}
                onPaste={this.handlePaste}

              />
              {/* <div>
                                {this.state.html}
                            </div> */}
              {/* <Mapping /> */}

            </div>
          </div>
        </div>
        <p className='credentials'>Developed by Swainson Holness</p>
      </div >
    );
  }
}



export default App;
