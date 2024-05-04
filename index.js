
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
                typeof(child) === 'object'?child:newTextElement(child)
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
}


/** @jsx monisReact.newElement*/
const element=monisReact.newElement(
    "div",
    {id:"big"},
    monisReact(a,null,"First"),
    monisReact(a,null,"Second")
    )

const container=document.getElementById('root')
monisReact.render(element,container)

//ReactDOM.render function will render everything on the screen. so we need to write our own version of render function

//Step-2 --Render function -------------------------------------------------------------------------------

//we Start by creating a new node and append it to the root node

// function render(element,container){
//     const newNode=document.createElement(element.type)
//     container.appendChild(newNode)

// }

//We start doing it for every child node too with new Node

function render(element,container){
    const newNode=
    element.type === 'ELEMENT_TEXY'?    //handle text node too
    document.createTextNode(""):
    document.createElement(element.type)
    element.props.children.forEach(child => {
        render(newNode,child)
    });
    container.appendChild(newNode)

}






