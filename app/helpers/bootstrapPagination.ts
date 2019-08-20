// @ts-ignore
const pagination = require('pagination');
 
export const create = function (prelink: string, current: number, rowsPerPage: number, totalResult: number, params: string) {
    return new pagination.TemplatePaginator({
        prelink: prelink, current: current, rowsPerPage: rowsPerPage,
        totalResult: totalResult, slashSeparator: true,
        template: function(result) {
            var i, len, prelink;
            var html = '<div><ul class="pagination">';
            if(result.pageCount < 2) {
                html += '</ul></div>';
                return html;
            }
            prelink = this.preparePreLink(result.prelink);
            if(result.previous) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + params + '">' + this.options.translator('PREVIOUS') + '</a></li>';
            }
            if(result.range.length) {
                for( i = 0, len = result.range.length; i < len; i++) {
                    if(result.range[i] === result.current) {
                        html += '<li class="active page-item"><a class="page-link" href="' + prelink + result.range[i] + params + '">' + result.range[i] + '</a></li>';
                    } else {
                        html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + params + '">' + result.range[i] + '</a></li>';
                    }
                }
            }
            if(result.next) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + params + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
            }
            html += '</ul></div>';

            return html;
        }
    });
};