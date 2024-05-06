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

function newElement(type,props,...children){
    return {
        type:type,
        props:{
            ...props,    
            children:children.map((child)=>{
                return typeof(child) === 'object'?child:newTextElement(child)
            }) 
        }

    }
}

function newTextElement(text){
    return {
        type:"ELEMENT_TEXY",
        props:{
            nodeValue:text,
            children:[]
        }
    }
}

//Now the thing we have done above that assigning children with primitive values with empty array is not done in react but we will do it so it is easy for us
//now we need a name for our library so that we can finally use our funtion that we have created

const monisReact={
    newElement,
    render,
    useState,
}


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
// const element=(
//     <h1 style="color:red;background:aqua">Hello Monis!</h1>
// )
// const container=document.getElementById('root')
// monisReact.render(element,container)

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

function createDom(fiber){
    //create a new element
    const newNode = fiber.type !== 'ELEMENT_TEXY'?document.createElement(fiber.type):document.createTextNode("")
    //assign properties to new node from fiber.props
    Object.keys(fiber.props).filter(key=>key !== "children").forEach(prop=>{newNode[prop]=fiber.props[prop]})
    return newNode;
}

//in the render function we set wiprogressRoot of work to the "ROOT" of the fibre tree
function render(element,container){
    wiprogressRoot={
        dom:container,
        props:{
            children:[element]
        },
        //alternate property is the link to the old fiber we committed to the dom
        alternate:currentRoot
    }
    deletions=[]
    nextUnitOfWork=wiprogressRoot
}

let wiprogressRoot = null;
let nextUnitOfWork = null;
let currentRoot = null;
let deletions=null;

//Now when the browser will be ready it will call our workloop functionn

function workLoop(deadline){
    let shouldYield=false

    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork=performUnitOfWork(nextUnitOfWork)
        shouldYield=deadline.timeRemaining()<1
    }
    while(!nextUnitOfWork && wiprogressRoot)
        commitRoot();

    requestIdleCallback(workLoop)//this schedules the workloop function to work when browser is idle
}

requestIdleCallback(workLoop)//this schedules the workloop function to work when browser is idle

// function performUnitOfWork(fiber) {
//     //when fibre will be the root of the tree.It's dom will be null. dont confuse it with the value container as given above. here dom means the children of that particular fibre

//     //with this if condition we will add div to the root of the tree
//     if (!fiber.dom) {
//       fiber.dom = createDom(fiber)
//     }

//     //then add it's children to it's too

//     const elements = fiber.props.children
//     reconcileChildren(fiber,elements)

//     //then we search for next unit of work
//     //1st child is tried

//     if (fiber.child) {
//       return fiber.child
//     }

//     //then sibling is tried and if not get the parent sibling means uncle is tried
//     //here nextfiber for uncle will work like this-- nextfiber.sibling will be null so nextfiber will be parent
//     //then nextfiber will again run because of while loop and now it will target uncle because it is  one way up in the tree structure.
//     let nextFiber = fiber
//     while (nextFiber) {
//       if (nextFiber.sibling) {
//         return nextFiber.sibling
//       }
//       nextFiber = nextFiber.parent
//     }
//   }

//compare the props of the old fiber to the props of the new fiber
//remove the props that are gone and set the props that are new and changed
 
const isEvent = key => key.startsWith("on") //this checks if key is event related or not because in React event handlers starts with "on prefix"
const isProperty=key => key!== "children" && !isEvent(key)  //this checks if key is not equal to children and key is not event related

  function updateDom(dom,prevProps, nextProps){
    //if event listeners changed we remove it from the node
    //We are removing old or changed event listeners because we need DOM and it's associated event handling is in sync with current state of application
    //below line
    //--get array of keys from previous props
    //-- filter the array to include keys that are event related
    //-- another filter -- key is not present in the next props or considered new
    Object.keys(prevProps).filter(isEvent).filter(key =>!(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2) //convert to lowercase and remove "on"
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

    //Add event listeners(add new handlers)
    Object.keys(prevProps).filter(isEvent).filter(isNew(prevProps,nextProps)).forEach(name=>{
        const eventType =name.toLowerCase().substring(2)

        dom.addEventListener(
            eventType,
            nextProps[name]
        )
    })

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
    function commitRoot(){
        deletions.forEach(commitWork)
        commitWork(wiprogressRoot.child)
        //after the work is done the currentRoot will contain the reference of last fibre tree we committed to the dom
        currentRoot = wiprogressRoot
        wiprogressRoot=null
    }

    //we also need to change the commit work to handle the new effect tags

    // function commitWork(fiber){
    //     if(!fiber)
    //         return

    //     const domParent = fiber.parent.dom;

    //     if(fiber.effectTag === 'PLACEMENT' && fiber.dom!=null)
    //     domParent.appendChild(fiber.dom)  
    // //here we are doing fibre.dom and not fibre because fibre represent the element in the virtual dom which will not make sense so fibre.dom holds the reference to actual dom element  
    // else if(fiber.effectTag === "DELETION")
    //     domParent.removeChild(fiber.dom)

    // else if(fiber.effectTag === "UPDATE" && fiber.dom!=null){
    //     updateDom(fiber.dom,fiber.alternate.props,fiber.props)
    // }
    //     commitWork(fiber.child)
    //     commitWork(fiber.sibling)
    // }

    //here we will reconcile old fibers with new one
    // here two most important things are oldFiber and element
    //oldFiber -- is what we render the last time
    //element -- thing we want to render 
    //We need to compare them to see if there’s any change we need to apply to the DOM.
    //to compare them we use the type or more specifically sametype variable

    function reconcileChildren(wipFiber,elements){
        let index = 0
    let prevSibling = null
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child

    while (index < elements.length || oldFiber!=null) {
      const element = elements[index]

      let newFiber=null;

      const sameType= oldFiber && element && element.type == oldFiber.type 


//if they have the same type that means we have to update it with the new props and we can keep the dom node
//we create a dom node keeping the dom node from the old fiber and the props from the new element
      if(sameType){
        newFiber={
            type:oldFiber.type,
            props:element.props,
            dom:oldFiber.dom,
            parent:wipFiber,
            alternate:oldFiber,
            effectTag:"UPDATE",
        }
      }
//the type is different it means something was added to the dom. here we are checking if something was added
// element needs a new dom node
      if(element && !sameType){
        newFiber={
            type:element.type,
            props:element.props,
            dom:null,
            parent:wipFiber,
            alternate:null,
            effectTag:"PLACEMENT"
        }
      }

//the type is different it means something was added to the removed. here we are checking if something was removed
//as for the case of deletion, we commit the fibre tree to the dom, we do it from the workinprogressRoot which doesnt have oldFibers
      if(oldFiber && !sameType){
        oldFiber.effectTag="DELETION"
        deletions.push(oldFiber) //so we need an array to keep track of the nodes we want to remove.
      }

      if (index === 0) {
        wipFiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }

      prevSibling = newFiber
      index++
    }
    }

    //Function components-------------------------------------------------------------------------

    ///Lets add support for the function components
    function Counter(){
        const [state,setState]=monisReact.useState(1)

        return (
            <h1 onClick={()=>setState(state=>state+1)}>Count is:{state}</h1>
        )
    }
    const element = <Counter/>
    const container = document.getElementById('root')
    monisReact.render(element, container)

    //function component are different in two ways 
    // 1.  fiber from function component doesnt have a dom node
    //2. children come from running the function instead of
    // getting them directly from the props

    //we will change perform unit of work now according to function components
    function performUnitOfWork(fiber) {

        const isFunctionComponent = fiber.type instanceof Function
        //if it is function we will handle it differently else as same as we were handling before with the reconcileChildren function
        if(isFunctionComponent)
            updateFunctionComponent(fiber)
        else
        updateHostComponent(fiber)
        
    
        //then we search for next unit of work
        //1st child is tried
    
        if (fiber.child) {
          return fiber.child
        }
    
        //then sibling is tried and if not get the parent sibling means uncle is tried
        //here nextfiber for uncle will work like this-- nextfiber.sibling will be null so nextfiber will be parent
        //then nextfiber will again run because of while loop and now it will target uncle because it is  one way up in the tree structure.
        let nextFiber = fiber
        while (nextFiber) {
          if (nextFiber.sibling) {
            return nextFiber.sibling
          }
          nextFiber = nextFiber.parent
        }
      }

      let wipFiber= null
      let hookIndex= null

      function updateFunctionComponent(fiber){
        wipFiber=fiber
        hookIndex=0
        wipFiber.hooks=[]
        const children = [fiber.type(fiber.props)]  //fiber.type is the App function here and when we run it returns the h1 element
        reconcileChildren(fiber, children)  //then everything works in the same way
      }

      function useState(initial){
        //when function component calls useState we check if we have an old hook. we check in the the alternate of the fiber
        const oldHook=wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]

        const hook = {
            state: oldHook?oldHook.state :initial,
            queue:[]
        }

        const actions=oldHook?oldHook.queue:[]
        actions.forEach(action=>{
            hook.state=action(hook.state)
        })

        const setState = action =>{
            hook.queue.push(action)
            //now we will do this process so that workloop can start and set the new render phase
            //we will set workinprogressRoot as nextunitofwork so that work loop can start a new render in phase
            wipRoot={
                dom:currentRoot.dom,
                props:currentRoot.props,
                alternate:currentRoot
            }
            nextUnitOfWork=wipRoot
            deletions=[]
        }

        //add new hook to the fiber, increment the hook index by one and return the state
        wipFiber.hooks.push(hook)
        hookIndex++;
        return [hook.state,setState]

      }

      function updateHostComponent(fiber){
        //when fibre will be the root of the tree.It's dom will be null. dont confuse it with the value container as given above. here dom means the children of that particular fibre
    
        //with this if condition we will add div to the root of the tree
        if (!fiber.dom) {
            fiber.dom = createDom(fiber)
          }
      
          //then add it's children to it's too
      
          const elements = fiber.props.children
          reconcileChildren(fiber,fiber.props.children)
      }

      //now what we need to change is the commitWork function
      //here we have fibers without dom nodes so we neeed to do two things
      function commitWork(fiber){
        if(!fiber)
            return

        //first to find the parent of the dom node by going up the fiber tree until we find a fibre with a dom node
        //fiber is the representation in the virtual dom and dom node is actual dom element in the browser document object model
        let domParentFiber = fiber.parent
        while(!domParentFiber.dom)
            domParentFiber=domParentFiber.parent

        const domParent = domParentFiber.dom
 


        if(fiber.effectTag === 'PLACEMENT' && fiber.dom!=null)
        domParent.appendChild(fiber.dom)  
    //here we are doing fibre.dom and not fibre because fibre represent the element in the virtual dom which will not make sense so fibre.dom holds the reference to actual dom element  
    else if(fiber.effectTag === "DELETION")
        commitDeletion(fiber,domParent)

    else if(fiber.effectTag === "UPDATE" && fiber.dom!=null){
        updateDom(fiber.dom,fiber.alternate.props,fiber.props)
    }
        commitWork(fiber.child)
        commitWork(fiber.sibling)
    }

    function commitDeletion(fiber,domParent){
        if(fiber.dom)
            domParent.removeChild(fiber.dom)
        else
        commitDeletion(fiber.child,domParent)  //And when removing a node we also need to keep going until we find a child with a DOM node.
    }

