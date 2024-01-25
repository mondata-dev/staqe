<template>
  <div class="nq-card p-8 md:p-20">
    <div class="nq-card-header !py-6">
      <div class="my-0 text-start">
        <slot name="header" />
      </div>
    </div>
    <div class="nq-card-body">
      <slot name="body" />
    </div>
  </div>
</template>
