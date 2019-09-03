// @ts-ignore
const pagination = require('pagination');

/**
 *
 * @param {string} prelink
 * @param {number} current
 * @param {number} rowsPerPage
 * @param {number} totalResult
 * @param {string} params
 * @return {any}
 */
export const create = function (prelink: string, current: number, rowsPerPage: number, totalResult: number, params: string): any {
  return new pagination.TemplatePaginator({
    prelink,
    current,
    rowsPerPage,
    totalResult,
    slashSeparator: true,
    template(result) {
      let i; let len; let
        prelink;
      let html = '<div><ul class="pagination">';
      if (result.pageCount < 2) {
        html += '</ul></div>';
        return html;
      }
      prelink = this.preparePreLink(result.prelink);
      if (result.previous) {
        html += `<li class="page-item"><a class="page-link" href="${prelink}${result.previous}${params}">${this.options.translator('PREVIOUS')}</a></li>`;
      }
      if (result.range.length) {
        for (i = 0, len = result.range.length; i < len; i++) {
          if (result.range[i] === result.current) {
            html += `<li class="active page-item"><a class="page-link" href="${prelink}${result.range[i]}${params}">${result.range[i]}</a></li>`;
          } else {
            html += `<li class="page-item"><a class="page-link" href="${prelink}${result.range[i]}${params}">${result.range[i]}</a></li>`;
          }
        }
      }
      if (result.next) {
        html += `<li class="page-item"><a class="page-link" href="${prelink}${result.next}${params}" class="paginator-next">${this.options.translator('NEXT')}</a></li>`;
      }
      html += '</ul></div>';

      return html;
    },
  });
};
