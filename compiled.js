"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* 

STEP 0:-------------------------------------------------------------------------------------------------------
const element = <p title="This is a paragraph">A paragraph element</p>
const container = document.getElementById("root")
ReactDOM.render(element, container)


//First replace these 3 lines into pure vanilla javascript

This is pure JSX, we need to convert this into vanilla javascript

Now, React.createElement creates an object from it's argument
That's all it does beyond some validation
const element=React.createElement(
    "p",
    props:{title:"This is a paragraph"},
    "A paragraph element"
)

So this is what element is, an object with two properties type and props 

*/
//Defining element. What type of element, it's attributes values and it's children

// const element={
//     type:"p",
//     props:{
//         title:"This is a paragraph",
//         children:"A paragraph"
//     }
// }

//Children in this case is a string but it can also have other elements inside it so children can be array too

// const container = document.getElementById("root")

//The other piece we need to replace is this rendering.This is how react changes the dom and we need to do it ourselves
// ReactDOM.render(element, container)

//First we will create an element according to the definition that we have got above in the element variable.

// const node=document.createElement(element.type)
// node["title"]=element.props.title

// const text=document.createTextNode("")
// text["nodeValue"]=element.props.children

//using textnode here because it will allow us to treat every element in the same way. we are assuming that chidren has further props rather than just a string

// node.appendChild(text)
// container.appendChild(node)

/* 
STEP 1----------------------------------------------------------------------------------------------------------
Now we will create the createElement function by ourself in pure vanilla javascript which will return an object
we will create for this element
const element=(
    <div id="big">
    <a>First</a>
    <a>Second</a>
    </div>
)

*/

// function createElement(type,props,...children){
//     //Function parameters
//     //...children--allow you to pass any number of children
//     return {
//         type:type,
//         props:{
//             ...props,     //spreads the properties of object into new object like id,style
//             children      //it is a rest parameter. It will capture everything as an array
//         }

//     }
// }

/* 
So, createElement(div) gives
{
    type:div,
    props:{children:[]}
}

createElement(div,null,a,a) gives
{
    type:div
    props:{children:[a,a]}
}

Our children array can have primitive values like strings and numbers rather than elements.So we will wrap them over themselves and give it a new type called "ELEMENT_TEXY"    
So now code will be:
*/

function newElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  return {
    type: type,
    props: _objectSpread(_objectSpread({}, props), {}, {
      children: children.map(function (child) {
        return _typeof(child) === 'object' ? child : newTextElement(child);
      })
    })
  };
}
function newTextElement(text) {
  return {
    type: "ELEMENT_TEXY",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

//Now the thing we have done above that assigning children with primitive values with empty array is not done in react but we will do it so it is easy for us
//now we need a name for our library so that we can finally use our funtion that we have created

var monisReact = {
  newElement: newElement,
  render: render
};

/** @jsx monisReact.newElement*/
// const element=monisReact.newElement(
//     "div",
//     {id:"big"},
//     monisReact.newElement("p",null,"First"),
//     monisReact.newElement("p",null,"Second")
//     )

/** @jsx monisReact.newElement*/
// const element1=(
//     <div style={{background:"aqua"}}> 
//         <h1>Hello World!</h1>
//     </div>
// )

/** @jsx monisReact.newElement*/
var element = monisReact.newElement("h1", {
  style: "color:red;background:aqua"
}, "Hello Monis!");
var container = document.getElementById('root');
monisReact.render(element, container);

//ReactDOM.render function will render everything on the screen. so we need to write our own version of render function

//Step-2 --Render function -------------------------------------------------------------------------------

//we Start by creating a new node and append it to the root node

// function render(element,container){
//     const newNode=document.createElement(element.type)
//     container.appendChild(newNode)

// }

//We start doing it for every child node too with new Node

//so here in render function
//--created the element according to the type
//--applied every prop to the element
//--then render the children

// function render(element,container){
//     //create a new element
//     const newNode = element.type !== 'ELEMENT_TEXY'?document.createElement(element.type):document.createTextNode("")
//     //assign properties to new node from element.props
//     Object.keys(element.props).filter(key=>key !== "children").forEach(prop=>{newNode[prop]=element.props[prop]})
//     //render if there are any more children
//     element.props.children.forEach(child => {
//         render(child,newNode)
//     });
//     //finally append everything to the main root node
//     container.appendChild(newNode);
// }

/* STEP -3 ------------------------------------------------------------------------------------------------- 
Now we need concurrent mode because if element tree is too big recursive rendering call might block the main thread for too long. if browser needs to do high priority stuff it will have to it until the render finishes.

so we are going to break the work into small units and we will interrupt the rendering if browser needs to some other important work

replace function render with function createDom to create fibers
*/

function createDom(fiber) {
  //create a new element
  var newNode = fiber.type !== 'ELEMENT_TEXY' ? document.createElement(fiber.type) : document.createTextNode("");
  //assign properties to new node from fiber.props
  Object.keys(fiber.props).filter(function (key) {
    return key !== "children";
  }).forEach(function (prop) {
    newNode[prop] = fiber.props[prop];
  });
  return newNode;
}

//in the render function we set wiprogressRoot of work to the "ROOT" of the fibre tree
function render(element, container) {
  wiprogressRoot = {
    dom: container,
    props: {
      children: [element]
    },
    //alternate property is the link to the old fiber we committed to the dom
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wiprogressRoot;
}
var wiprogressRoot = null;
var nextUnitOfWork = null;
var currentRoot = null;
var deletions = null;

//Now when the browser will be ready it will call our workloop functionn

function workLoop(deadline) {
  var shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  while (!nextUnitOfWork && wiprogressRoot) commitRoot();
  requestIdleCallback(workLoop); //this schedules the workloop function to work when browser is idle
}
requestIdleCallback(workLoop); //this schedules the workloop function to work when browser is idle

function performUnitOfWork(fiber) {
  //when fibre will be the root of the tree.It's dom will be null. dont confuse it with the value container as given above. here dom means the children of that particular fibre

  //with this if condition we will add div to the root of the tree
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  //then add it's children to it's too

  var elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  //then we search for next unit of work
  //1st child is tried

  if (fiber.child) {
    return fiber.child;
  }

  //then sibling is tried and if not get the parent sibling means uncle is tried
  //here nextfiber for uncle will work like this-- nextfiber.sibling will be null so nextfiber will be parent
  //then nextfiber will again run because of while loop and now it will target uncle because it is  one way up in the tree structure.
  var nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

//compare the props of the old fiber to the props of the new fiber
//remove the props that are gone and set the props that are new and changed

var isEvent = function isEvent(key) {
  return key.startsWith("on");
}; //this checks if key is event related or not because in React event handlers starts with "on prefix"
var isProperty = function isProperty(key) {
  return key !== "children" && !isEvent(key);
}; //this checks if key is not equal to children and key is not event related

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  //below line
  //--get array of keys from previous props
  //-- filter the array to include keys that are event related
  //-- another filter -- key is not present in the next props or considered new
  Object.keys(prevProps).filter(isEvent).filter(function (key) {
    return !(key in nextProps) || isNew(prevProps, nextProps)(key);
  }).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2); //convert to lowercase and remove "on"
    dom.removeEventListener(eventType, prevProps[name]);
  });

  //Add event listeners(add new handlers)
}

/** STEP-5---------------0--RENDER AND COMMIT PHASES----------------------------------------------------- 
 * the way we are writing code above in the perform unit of work the browser could interuupt our work before we finish rendering so we will remove this piece of code
 if (fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom)
    }
 * So we dont want that. That could display the incomplete UI. So to prevent that we will keep track of the root of the fibre tree

    Remove the above code base and add workinprogressRoot in the render function above to keep track of root of the fibre tree
 * */
//when commtting changes to the dom we also use fibers from that deletion array
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wiprogressRoot.child);
  //after the work is done the currentRoot will contain the reference of last fibre tree we committed to the dom
  currentRoot = wiprogressRoot;
  wiprogressRoot = null;
}

//we also need to change the commit work to handle the new effect tags

function commitWork(fiber) {
  if (!fiber) return;
  var domParent = fiber.parent.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) domParent.appendChild(fiber.dom);
  //here we are doing fibre.dom and not fibre because fibre represent the element in the virtual dom which will not make sense so fibre.dom holds the reference to actual dom element  
  else if (fiber.effectTag === "DELETION") domParent.removeChild(fiber.dom);else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

//here we will reconcile old fibers with new one
// here two most important things are oldFiber and element
//oldFiber -- is what we render the last time
//element -- thing we want to render 
//We need to compare them to see if there’s any change we need to apply to the DOM.
//to compare them we use the type or more specifically sametype variable

function reconcileChildren(wipFiber, elements) {
  var index = 0;
  var prevSibling = null;
  var oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  while (index < elements.length || oldFiber != null) {
    var _element = elements[index];
    var newFiber = null;
    var sameType = oldFiber && _element && _element.type == oldFiber.type;

    //if they have the same type that means we have to update it with the new props and we can keep the dom node
    //we create a dom node keeping the dom node from the old fiber and the props from the new element
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: _element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    //the type is different it means something was added to the dom. here we are checking if something was added
    // element needs a new dom node
    if (_element && !sameType) {
      newFiber = {
        type: _element.type,
        props: _element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }

    //the type is different it means something was added to the removed. here we are checking if something was removed
    //as for the case of deletion, we commit the fibre tree to the dom, we do it from the workinprogressRoot which doesnt have oldFibers
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber); //so we need an array to keep track of the nodes we want to remove.
    }
    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}
