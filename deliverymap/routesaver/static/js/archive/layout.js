function toggle_layout(layout_num) {
    const map = document.createElement('div');
    map.id = "map";
    const active = document.createElement('div');
    active.id = "active-route";

    const row_0 = document.createElement('div');
    row_0.className = "row";
    const row_1 = document.createElement('div');
    row_1.className = "row";

    const left_column = document.createElement('div');
    left_column.className = "col-5";

    const right_column = document.createElement('div');
    right_column.className = "col-7";

    
    // construct window based on format
    if(layout_num == 1){
      const display = document.querySelector('#display-window');
      display.innerHTML = "";
      row_0.append(map);
      row_1.append(active);
      display.append(row_0,row_1);
      initMap();
    }
    else {
      const display = document.querySelector('#display-window');
      display.innerHTML = "";
      left_column.append(map);
      right_column.append(active);
      row_0.append(left_column, right_column);
      display.append(row_0);
      initMap();
    }
  }
  
  