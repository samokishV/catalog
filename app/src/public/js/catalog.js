$(document).ready(() => {
  $("[name='order']").on('change', () => {
    document.forms.search.submit();
  });
});
