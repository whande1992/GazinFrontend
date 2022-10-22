<template>
  <nav class="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img alt="" class="d-inline-block align-text-top" height="24" src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg"
             width="30">
        Best Developers
      </a>
      <button aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"
              data-bs-target="#navbarNavDropdown" data-bs-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNavDropdown" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/developers"><a aria-current="page" class="nav-link " href="#">Developers</a></RouterLink>

          </li>
          <li class="nav-item">
            <RouterLink to="/levels"><a class="nav-link" href="#">Niveis</a></RouterLink>

          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

</script>