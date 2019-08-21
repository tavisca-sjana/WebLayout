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
      var target = e.target;
      var parent = target.parentElement.parentElement;
      var parent_id = parent.getAttribute("id");

    if(target.innerHTML == "Delete")
    {
        RemoveTodo(parent_id);  
        ClearDom(parent);
    }
    else
    {
        ShowModal();
        EditTodo(parent_id);

    }
      console.log(target.innerHTML);
     
  })

  function ShowModal()
  {
    
        document.querySelector('.bg-modal').style.display = "flex";
        
  }
  

document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});

function EditTodo(target_id)
{
    //document.getElementById("text_in_modal").value = todo_list[target_id];
    var it;
    for(it = 0;it<todo_list.length;it++)
      {
          if(todo_list[it].id == target_id)
          {
            document.getElementById("text_in_modal").value = todo_list[it].data;
            current_edit_id = it;
          }
      }

}

document.querySelector("#add_in_modal").addEventListener("click",() => {
    todo_list[current_edit_id].data = document.getElementById("text_in_modal").value;
    Store.SetTodo();
    document.querySelector(".bg-modal").style.display = none;
    
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
    // var table = document.getElementById("todo_content");
    console.log("Child");
    todo_list_length = todo_list.length;
    var child = node.childNodes[0];
    while (child) { 
        node.removeChild(child); 
        child = node.lastElementChild; 
    }
    todo_list = [];
  }

  function PopulateTodoList()
  {
    todo_list.forEach(element => {

        PopulateTodoDom(element.data,element.id);
    });
  }

  function PopulateTodoDom(todo_value,todo_id)
  {
    var table = document.getElementById("todo_content");
    var row = document.createElement("tr");
    row.setAttribute("id",`${todo_id}`)
    var todo = document.createElement("td");
    var edit_button = document.createElement("td");
    var delete_button = document.createElement("td");
    todo.innerHTML = "<p>"+todo_value+"</p>";
    edit_button.innerHTML = "<button id=edit+>Edit</button></td>";
    delete_button.innerHTML = "<button id=delete>Delete</button>";
    row.append(todo);
    row.append(edit_button);
    row.append(delete_button);
    table.append(row);
    Store.SetTodo(todo_list);
  }


document.getElementById("add").addEventListener("click", function(){
    // console.log(document.getElementById("search").value);
    AddTodo(document.getElementById("search").value)
    document.getElementById("search").value  = "";
    //console.log("Hello");
  });

  

  function AddTodo(todo_value)
  {
      
    current_id = current_id+1;
    todo_list.push({id:current_id,data:todo_value})
    var table = document.getElementById("todo_content");
    var row = document.createElement("tr");
    row.setAttribute("id",`${current_id}`)
    var todo = document.createElement("td");
    var edit_button = document.createElement("td");
    var delete_button = document.createElement("td");
    todo.innerHTML = "<p>"+todo_value+"</p>";
    edit_button.innerHTML = "<button id=edit+>Edit</button></td>";
    delete_button.innerHTML = "<button id=delete>Delete</button>";
    row.append(todo);
    row.append(edit_button);
    row.append(delete_button);
    table.append(row);
    Store.SetTodo(todo_list);
    ViewTodo();
   
  }

  function ViewTodo()
  {
      todo_list.forEach(element => {

          console.log(element.id);
          console.log(element.data);
      });
  }

//console.log(searchBarContent);