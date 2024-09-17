const today  = new Date();
var todo_list;
var current_id;
var current_edit_id;

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
    todo_list = Store.GetTodo();
    if(todo_list.length != 0)
    {
        current_id = todo_list[todo_list.length-1].id;
        PopulateTodoList();
    }
    else
    {
        current_id = 0;
    }
    }
  }

  document.getElementById("clear").addEventListener("click",function(){
      Store.Clear();
  })

  

  document.querySelector("#todo_content").addEventListener("click",function(e){
      let target = e.target;
      let parent = target.parentElement.parentElement;
      let parent_id = parent.getAttribute("id");
      //console.log(target);

    if(target.innerHTML == "Delete")
    {
        RemoveTodo(parent_id);  
        ClearDom(parent);
    }
    else if(target.innerHTML == "Edit")
    {
        ShowModal();
        EditTodo(parent_id,parent);
        
    }

    else
    {
        console.log("status clicked");
        // document.getElementById("status").setAttribute("class","fas fa-circle");
        // document.getElementById("status").style.color = "green";
        ToggleStatus(target.parentElement.getAttribute("id"));
        ClearDom(document.getElementById("todo_content"));
        PopulateTodoList();
        
    }
      
     
  })



  function ToggleStatus(parent_id)
  {
      let i;
      
      for(i=0;i<todo_list.length;i++)
      {
          
          if(todo_list[i].id == parent_id)
          {
            
              todo_list[i].status = Math.abs(todo_list[i].status-1);
              console.log(todo_list[i].status);
              Store.SetTodo();
              break;
          }
      }
      

  }

  function ShowModal()
  {
    
        document.querySelector('.bg-modal').style.display = "flex";
        
  }
  

document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});

function EditTodo(target_id,parent)
{
    //document.getElementById("text_in_modal").value = todo_list[target_id];
    var it;
    for(it = 0;it<todo_list.length;it++)
      {
          if(todo_list[it].id == target_id)
          {
            document.getElementById("text_in_modal").value = todo_list[it].data;
            current_edit_id = it;
            
            break;
          }
      }
 
}


document.querySelector("#add_in_modal").addEventListener("click",() => {
    todo_list[current_edit_id].data = document.getElementById("text_in_modal").value;
    Store.SetTodo();
    document.querySelector(".bg-modal").style.display = 'none';
    ClearDom(document.getElementById("todo_content"));
    PopulateTodoList();
    
})


  function RemoveTodo(target_id)
  {
      for(var it = 0;it<todo_list.length;it++)
      {
          if(todo_list[it].id == target_id)
          {
              todo_list.splice(it,1);
          }
      }
      Store.SetTodo();
  }

  class Store
  {
      static GetTodo()
      {
        if(localStorage.getItem("todo_list") == null)
            return [];
        else
            return JSON.parse(localStorage.getItem("todo_list"));
      }

      static SetTodo()
      {
          localStorage.setItem("todo_list",JSON.stringify(todo_list));
      }

      static Clear()
      {
          localStorage.clear();
          current_id = 0;
          var table = document.getElementById("todo_content");
          ClearDom(table);
      }
  }

  function ClearDom(node)
  {
    
    todo_list_length = todo_list.length;
    var child = node.childNodes[0];
    while (child) { 
        node.removeChild(child); 
        child = node.lastElementChild; 
    }
    //todo_list = [];
  }

  

  function PopulateTodoList()
  {
    for(let i=0;i<todo_list.length;i++)
    {
        PopulateTodoDom(i);
    }
  }

  function IncompleteStatusIconBuilder()
  {
    var status_icon = document.createElement("i");
    status_icon.setAttribute("id","status");
    status_icon.setAttribute("class","far fa-circle");
    status_icon.style.fontSize = "30px";
    status_icon.style.marginTop = "16px";
    status_icon.style.marginLeft = "16px";
    status_icon.style.marginRight = "16px";
    return status_icon;
  }

  function CompleteStatusIconBuilder()
  {
    var status_icon = document.createElement("i");
    status_icon.setAttribute("id","status");
    status_icon.setAttribute("class","fas fa-circle");
    status_icon.style.fontSize = "30px";
    status_icon.style.marginTop = "16px";
    status_icon.style.marginLeft = "16px";
    status_icon.style.marginRight = "16px";
    return status_icon;
  }

  
 function MakeEditButtonContent()
 {
     return "<button id=edit style='margin:10px;padding:10px'>Edit</button></td>";
 }

 function MakeDeleteButtonContent()
 {
    return "<button id=delete style='margin:10px;padding:10px'>Delete</button>";
 }

 function MakeTodoContent(todo_index)
 {
    if(!todo_list[todo_index].status)
    {
        return "<p>"+todo_list[todo_index].data+"</p>";
    }
    else
    {
        return "<p><del>"+todo_list[todo_index].data+"</del></p>";   
    }
 }




  function PopulateTodoDom(todo_index)
  {
    var table = document.getElementById("todo_content");
    var row = document.createElement("tr");
    row.setAttribute("id",`${todo_list[todo_index].id}`);
    status_icon = (todo_list[todo_index].status)?CompleteStatusIconBuilder():IncompleteStatusIconBuilder();
    var todo = document.createElement("td");
    var edit_button = document.createElement("td");
    var delete_button = document.createElement("td");
    todo.innerHTML = MakeTodoContent(todo_index);
    edit_button.innerHTML = MakeEditButtonContent();
    delete_button.innerHTML = MakeDeleteButtonContent();
    row.append(status_icon);
    row.append(todo);
    row.append(edit_button);
    row.append(delete_button);
    table.append(row);
    Store.SetTodo(todo_list);
  }


document.getElementById("add").addEventListener("click", function(){
    // console.log(document.getElementById("search").value);
    ClearDom(document.getElementById("todo_content"));
    PopulateTodoList();
    let todoValue = document.getElementById("add_and_search").value.trim();
    if(todoValue != "" && !TodoExists(todoValue))
        AddTodo(todoValue);
    document.getElementById("add_and_search").value  = "";
    //console.log("Hello");
  });

  function TodoExists(todoValue)
  {
      todo_list.forEach(todo => {

        if(todo == todoValue)
            return true;
          
      });

      return false;
  }

  

  function AddTodo(todo_value)
  {
      
    current_id = current_id+1;
    let status = 0; 
    todo_list.push({id:current_id,data:todo_value,status:status});
    var table = document.getElementById("todo_content");
    var row = document.createElement("tr");
    row.setAttribute("id",`${current_id}`);
    status_icon = IncompleteStatusIconBuilder();
    var todo = document.createElement("td");
    var edit_button = document.createElement("td");
    var delete_button = document.createElement("td");
    todo.innerHTML = "<p>"+todo_value+"</p>";
    edit_button.innerHTML = MakeEditButtonContent();
    delete_button.innerHTML = MakeDeleteButtonContent();
    row.append(status_icon);
    row.append(todo);
    row.append(edit_button);
    row.append(delete_button);
    table.append(row);
    Store.SetTodo(todo_list);
    ViewTodo();
   
  }

  document.getElementById("add_and_search").addEventListener("keyup",(e) => {
    let searchKeyword = document.getElementById("add_and_search").value;
    console.log(searchKeyword);
    if(searchKeyword == "")
    {
        ClearDom(document.getElementById("todo_content"));
        PopulateTodoList();
    }
        
    else
    {
        ClearDom(document.getElementById("todo_content"));
        for(let i = 0;i<todo_list.length;i++)
        {
            if(todo_list[i].data.indexOf(searchKeyword) > -1)
            {
                console.log(todo_list[i].data);
                PopulateTodoDom(i);
            }

            else
            {

            }
            
        }

    }
    //ClearDom(document.getElementById("todo_content"));
    
  })

  


  function ViewTodo()
  {
      todo_list.forEach(element => {

          console.log(element.id);
          console.log(element.data);
      });
  }

//console.log(searchBarContent);