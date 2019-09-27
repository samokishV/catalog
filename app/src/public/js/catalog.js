$(document).ready(() => {
  $("[name='sort']").on('change', () => {
    document.forms.search.submit();
  });
});
