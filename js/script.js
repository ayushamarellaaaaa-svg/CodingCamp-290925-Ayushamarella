document.addEventListener('DOMContentLoaded', () => {

  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const searchInput = document.getElementById('searchInput');
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  const totalTasks = document.getElementById('totalTasks');
  const completedTasks = document.getElementById('completedTasks');
  const pendingTasks = document.getElementById('pendingTasks');
  const progressPercent = document.getElementById('progressPercent');
  const toastContainer = document.getElementById('toast-container');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // ================= Typed.js =================
  new Typed('#typed', {
    strings: [
      "Selamat Datang di RevoU To-Do List",
      "Tambahkan tugasmu sekarang!",
      "Kelola tugas dengan mudah!"
    ],
    typeSpeed:50,
    backSpeed:30,
    backDelay:1500,
    loop:true
  });

  // ================= Toast =================
  function showToast(msg, color='#ff6f91'){
    const toast = document.createElement('div');
    toast.className='toast';
    toast.style.backgroundColor = color;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(()=>toast.classList.add('show'),100);
    setTimeout(()=>{ toast.classList.remove('show'); setTimeout(()=>toast.remove(),500); },2000);
  }

  // ================= Render =================
  function renderTasks(filter=''){
    taskList.innerHTML='';
    const filtered = tasks.filter(t=>t.title.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach((task,i)=>{
      const row=document.createElement('tr');
      if(task.completed) row.classList.add('completed');
      row.innerHTML=`
        <td>${task.title}</td>
        <td>${task.date}</td>
        <td>
          <button class="toggleBtn" data-index="${i}">${task.completed?'Belum':'Selesai'}</button>
          <button class="deleteBtn" data-index="${i}">Hapus</button>
        </td>
      `;
      taskList.appendChild(row);
    });
    updateStats();
    attachRowEvents();
  }

  function attachRowEvents(){
    document.querySelectorAll('.toggleBtn').forEach(btn=>{
      btn.addEventListener('click',()=>toggleComplete(btn.dataset.index));
    });
    document.querySelectorAll('.deleteBtn').forEach(btn=>{
      btn.addEventListener('click',()=>deleteTask(btn.dataset.index));
    });
  }

  // ================= Stats =================
  function updateStats(){
    const total = tasks.length;
    const completed = tasks.filter(t=>t.completed).length;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = total - completed;
    progressPercent.style.width = total === 0 ? '0%' : (completed/total*100)+'%';
  }

  // ================= Tambah Tugas =================
  addTaskBtn.addEventListener('click', ()=>{
    const title = taskInput.value.trim();
    const date = taskDate.value;
    if(!title || !date){
      showToast('Isi dulu semua form!', '#ff3b3b'); // merah kalau kosong
      return;
    }
    tasks.push({title,date,completed:false});
    localStorage.setItem('tasks',JSON.stringify(tasks));
    taskInput.value=''; taskDate.value='';
    renderTasks(searchInput.value);
    showToast('Tugas ditambahkan ✅', '#4CAF50'); // hijau kalau berhasil
  });

  // ================= Toggle =================
  function toggleComplete(i){
    tasks[i].completed = !tasks[i].completed;
    localStorage.setItem('tasks',JSON.stringify(tasks));
    renderTasks(searchInput.value);
    showToast(tasks[i].completed?'Tugas selesai ✅':'Tugas dibatalkan ❌', '#ff6f91');
  }

  // ================= Delete Tugas =================
  function deleteTask(i){
    const removed = tasks.splice(i,1)[0].title;
    localStorage.setItem('tasks',JSON.stringify(tasks));
    renderTasks(searchInput.value);
    showToast(`"${removed}" dihapus 🗑️`, '#ff6f91');
  }

  // ================= Delete All =================
  deleteAllBtn.addEventListener('click', ()=>{
    if(!tasks.length){
      showToast('Tidak ada tugas untuk dihapus ❌', '#ff3b3b');
      return;
    }
    // Konfirmasi custom
    const confirmBox = document.createElement('div');
    confirmBox.className = 'confirm-box';
    confirmBox.innerHTML = `
      <p>Yakin mau hapus semua tugas?</p>
      <div>
        <button id="yesBtn">Ya</button>
        <button id="noBtn">Tidak</button>
      </div>
    `;
    document.body.appendChild(confirmBox);

    document.getElementById('yesBtn').addEventListener('click', ()=>{
      tasks = [];
      localStorage.setItem('tasks',JSON.stringify(tasks));
      renderTasks();
      showToast('Semua tugas dihapus 🗑️', '#4CAF50');
      confirmBox.remove();
    });

    document.getElementById('noBtn').addEventListener('click', ()=>{
      confirmBox.remove();
      showToast('Dibatalkan ❌', '#ff6f91');
    });
  });

  // ================= Search =================
  searchInput.addEventListener('input', ()=>renderTasks(searchInput.value));

  renderTasks();

});
