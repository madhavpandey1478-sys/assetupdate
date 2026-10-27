
(function () {
    "use strict";

    /* =========================================================
       MODIFY ASSET - STANDALONE SAC CUSTOM WIDGET
       Component: com-madhav-modifyasset

       Asset ID                     : Read-only
       Description                  : Dropdown
       Company                      : Dropdown
       Cost Center                  : Dropdown
       Asset Class                  : Dropdown
       Capitalized Month            : Dropdown
       Asset Additional Description : Text input (last column)
       ========================================================= */

    var FIELDS = [
        {
            key: "description",
            label: "Description",
            width: 300,
            aliases: ["DESCRIPTION", "ASSET_DESCRIPTION", "ASSET DESCRIPTION", "TEXT", "ASSET"]
        },
        {
            key: "company",
            label: "Company",
            width: 190,
            aliases: ["COMPANY", "COMPANY_CODE", "COMPANYCODE"]
        },
        {
            key: "costCenter",
            label: "Cost Center",
            width: 220,
            aliases: ["COSTCENTER", "COST_CENTER", "COST CENTER"]
        },
        {
            key: "assetClass",
            label: "Asset Class",
            width: 190,
            aliases: ["ASSET_CLASS", "ASSETCLASS", "ASSET CLASS"]
        },
        {
            key: "capitalizedMonth",
            label: "Capitalized Month",
            width: 230,
            aliases: ["CAPITALIZED", "CAPITALIZED_MONTH", "CAPITALIZEDMONTH", "CWIP_T_MONTH"]
        },
        {
            key: "additionalDescription",
            label: "Asset Additional Description",
            width: 320,
            aliases: [
                "ASSET_ADDITIONAL_DESCRIPTION",
                "ASSET ADDITIONAL DESCRIPTION",
                "ADDITIONAL_DESCRIPTION",
                "ADDITIONALDESCRIPTION",
                "ADDITIONAL TEXT"
            ]
        }
    ];

    var DROPDOWN_FIELDS = [
        "description",
        "company",
        "costCenter",
        "assetClass",
        "capitalizedMonth"
    ];

    /* =========================================================
       CSS
       ========================================================= */

    var CSS = `
        :host {
            display:block;
            width:100%;
            height:100%;
            min-height:220px;
            font-family:"72","72full",Arial,Helvetica,sans-serif;
            color:#1d2d3e;
            box-sizing:border-box;
        }

        * { box-sizing:border-box; }

        .root {
            display:flex;
            flex-direction:column;
            width:100%;
            height:100%;
            min-height:220px;
            background:#fff;
            overflow:hidden;
        }

        .toolbar {
            min-height:70px;
            flex:0 0 auto;
            display:flex;
            align-items:center;
            flex-wrap:nowrap;
            gap:12px;
            padding:10px 12px;
            background:#f5f7fa;
            border-bottom:1px solid #e5e9ee;
        }

        .search {
            width:322px;
            min-width:180px;
            max-width:32%;
            height:42px;
            flex:0 1 322px;
            padding:0 14px;
            border:1px solid #c9d6e3;
            border-radius:8px;
            outline:none;
            background:#fff;
            color:#1d2d3e;
            font:14px "72",Arial,sans-serif;
        }

        .search::placeholder { color:#6a7b8c; }

        .search:focus {
            border-color:#0a6ed1;
            box-shadow:0 0 0 2px #0a6ed11f;
        }

        .visible {
            color:#5b6b7b;
            font-size:14px;
            white-space:nowrap;
        }

        .spacer { flex:1 1 auto; }

        button {
            height:36px;
            padding:0 16px;
            border:1px solid #c5d9f3;
            border-radius:8px;
            background:#fff;
            color:#0064d9;
            font:700 14px "72",Arial,sans-serif;
            cursor:pointer;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            white-space:nowrap;
            box-shadow:none;
            flex:0 0 auto;
        }

        button:hover {
            background:#f2f7ff;
            border-color:#9fc2f2;
        }

        button.primary {
            background:#0a6ed1;
            border-color:#0a6ed1;
            color:#fff;
        }

        button.primary:hover {
            background:#085caf;
            border-color:#085caf;
        }

        button.delete {
            color:#bb0000;
            border-color:#e6b5b5;
            background:#fff;
            display:none;
        }

        button.delete:hover {
            background:#fff4f4;
            border-color:#d98c8c;
        }

        button:disabled {
            opacity:.45;
            cursor:default;
        }

        .paging {
            min-height:56px;
            flex:0 0 auto;
            display:flex;
            align-items:center;
            justify-content:flex-end;
            gap:10px;
            padding:10px 12px;
            background:#fff;
            border-bottom:1px solid #e5e9ee;
            color:#5b6b7b;
            font-size:13px;
        }

        .paging button {
            height:36px;
            padding:0 15px;
        }

        .table-wrap {
            flex:1 1 auto;
            min-height:80px;
            overflow:auto;
            background:#fff;
            scrollbar-width:thin;
            scrollbar-color:#aebdca #f2f5f7;
        }

        .table-wrap::-webkit-scrollbar {
            width:12px;
            height:12px;
        }

        .table-wrap::-webkit-scrollbar-thumb {
            background:#b5c2cd;
            border-radius:8px;
            border:2px solid #f3f6f8;
        }

        table {
            border-collapse:separate;
            border-spacing:0;
            table-layout:fixed;
            min-width:1800px;
            width:100%;
        }

        th {
            position:sticky;
            top:0;
            z-index:3;
            height:46px;
            padding:0 12px;
            background:#eef2f7;
            color:#1d2d3e;
            border-bottom:1px solid #e0e6ec;
            font-size:14px;
            font-weight:700;
            text-align:left;
            white-space:nowrap;
        }

        td {
            height:58px;
            padding:8px 9px;
            border-bottom:1px solid #e5e9ee;
            background:#fff;
            vertical-align:middle;
        }

        tr:hover td { background:#fafbfd; }
        tr.selected td { background:#f2f7ff; }
        tr.selected:hover td { background:#e9f2ff; }

        .check-cell {
            width:84px;
            min-width:84px;
            max-width:84px;
            text-align:center;
            padding:0;
        }

        .sel-head {
            display:flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            height:46px;
        }

        input[type=checkbox] {
            appearance:none;
            -webkit-appearance:none;
            width:22px;
            height:22px;
            margin:0;
            border:1px solid #6a7b8c;
            border-radius:4px;
            background:#fff;
            cursor:pointer;
            vertical-align:middle;
            position:relative;
            flex:0 0 auto;
        }

        input[type=checkbox]:checked,
        input[type=checkbox]:indeterminate {
            background:#0a6ed1;
            border-color:#0a6ed1;
        }

        input[type=checkbox]:checked::after {
            content:"";
            position:absolute;
            left:6px;
            top:2px;
            width:6px;
            height:11px;
            border:solid #fff;
            border-width:0 2px 2px 0;
            transform:rotate(45deg);
        }

        input[type=checkbox]:indeterminate::after {
            content:"";
            position:absolute;
            left:4px;
            top:9px;
            width:12px;
            height:2px;
            background:#fff;
        }

        .asset-id {
            font-size:14px;
            color:#1d2d3e;
        }

        .ro {
            display:flex;
            align-items:center;
            height:38px;
            padding:0 12px;
            background:#eff2f6;
            border:1px solid #dde4ec;
            border-radius:6px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }

        /* Dropdowns and the additional-description input */

        .cell {
            display:block;
            width:100%;
            min-width:0;
            height:38px;
            padding:0 10px;
            border:1px solid #c9d6e3;
            border-radius:6px;
            background:#fff;
            color:#1d2d3e;
            font:14px "72",Arial,sans-serif;
            outline:none;
        }

        select.cell {
            cursor:pointer;
            text-overflow:ellipsis;
        }

        input.cell { padding:0 12px; }

        .cell:hover { border-color:#8fa6bd; }

        .cell:focus {
            border-color:#0a6ed1;
            box-shadow:0 0 0 2px #0a6ed11f;
        }

        .empty {
            height:70px;
            padding:25px;
            text-align:center;
            color:#748596;
            font-size:14px;
        }

        .status {
            flex:0 0 auto;
            min-height:38px;
            display:flex;
            align-items:center;
            gap:18px;
            flex-wrap:wrap;
            padding:8px 12px;
            background:#f5f7fa;
            border-top:1px solid #e5e9ee;
            color:#5b6b7b;
            font-size:12px;
        }

        .strong {
            color:#1d2d3e;
            font-weight:700;
        }

        .message {
            margin-left:auto;
            white-space:normal;
        }

        @media(max-width:1100px) {
            .toolbar { flex-wrap:wrap; }
            .search { max-width:100%; }
        }

        @media(max-width:700px) {
            .toolbar { gap:6px; }
            .search { width:210px; }
            button { padding:0 10px; }
            .paging {
                justify-content:flex-start;
                flex-wrap:wrap;
            }
            .message { margin-left:0; }
        }
    `;

    /* =========================================================
       HTML TEMPLATE
       ========================================================= */

    var template = document.createElement("template");

    template.innerHTML =
        '<style>' + CSS + '</style>' +
        '<div class="root">' +

            '<div class="toolbar">' +
                '<input id="search" class="search" type="search" ' +
                    'placeholder="Search Asset ID or description..." ' +
                    'aria-label="Search assets">' +
                '<span class="visible" id="visibleCount">Visible: 0</span>' +
                '<span class="spacer"></span>' +
                '<button id="loadBtn">Load Data</button>' +
                '<button id="deleteBtn" class="delete">Delete Selected</button>' +
                '<button id="saveBtn" class="primary">Save Changes</button>' +
                '<button id="clearBtn">Clear</button>' +
            '</div>' +

            '<div class="paging">' +
                '<span id="showing">Showing 0 to 0 of 0</span>' +
                '<button id="prevBtn">Previous</button>' +
                '<span id="pageLabel">Page 1 of 1</span>' +
                '<button id="nextBtn">Next</button>' +
            '</div>' +

            '<div class="table-wrap">' +
                '<table>' +
                    '<thead><tr id="headRow"></tr></thead>' +
                    '<tbody id="bodyRows"></tbody>' +
                '</table>' +
            '</div>' +

            '<div class="status">' +
                '<span>Total Rows: <span class="strong" id="total">0</span></span>' +
                '<span>Selected Rows: <span class="strong" id="selected">0</span></span>' +
                '<span>Modified Rows: <span class="strong" id="modified">0</span></span>' +
                '<span class="message" id="message">Load data to begin.</span>' +
            '</div>' +

        '</div>';

    /* =========================================================
       COMPONENT
       ========================================================= */

    class ModifyAsset extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: "open" })
                .appendChild(template.content.cloneNode(true));

            this._rows = [];
            this._lastEvent = "";
            this._page = 0;
            this._pageSize = 50;
            this._query = "";
            this._loaded = false;

            /*
             * Global dropdown options, supplied through setOptions().
             * Each row also retains its current value even if the
             * value is not included in the supplied option list.
             */
            this._options = {
                description: [],
                company: [],
                costCenter: [],
                assetClass: [],
                capitalizedMonth: []
            };

            this._bind();
            this._render();
        }

        connectedCallback() {
            this._fire("onReady", "ready");
        }

        /* =====================================================
           EVENTS
           ===================================================== */

        _bind() {
            var self = this;

            this.shadowRoot.getElementById("loadBtn").onclick = function () {
                self._message("Loading existing assets...");
                self._fire("onDataChange", "loadData");
            };

            this.shadowRoot.getElementById("saveBtn").onclick = function () {
                var modified = self._rows.filter(function (row) {
                    return row.isModified;
                });

                if (!modified.length) {
                    self._message("No changes to save.");
                    self._fire("onDataChange", "saveChanges|0");
                    return;
                }

                self._fire("onDataChange", "saveChanges|" + modified.length);
            };

            this.shadowRoot.getElementById("deleteBtn").onclick = function () {
                var selected = self._selectedRows();

                if (selected.length) {
                    self._fire("onDataChange", "deleteSelected|" + selected.length);
                }
            };

            this.shadowRoot.getElementById("clearBtn").onclick = function () {
                self.clearData();
                self._fire("onDataChange", "clear");
            };

            this.shadowRoot.getElementById("search").oninput = function (e) {
                self._query = e.target.value || "";
                self._page = 0;
                self._render();
            };

            this.shadowRoot.getElementById("prevBtn").onclick = function () {
                if (self._page > 0) {
                    self._page--;
                    self._render();
                }
            };

            this.shadowRoot.getElementById("nextBtn").onclick = function () {
                if (self._page < self._pageCount() - 1) {
                    self._page++;
                    self._render();
                }
            };
        }

        _fire(name, value) {
            this._lastEvent = String(value == null ? "" : value);
            this.dispatchEvent(new Event(name));
        }

        _message(message) {
            var element = this.shadowRoot.getElementById("message");
            if (element) {
                element.textContent = message || "";
            }
        }

        /* =====================================================
           DATA NORMALISATION
           ===================================================== */

        _readField(source, key) {
            var field = FIELDS.find(function (f) {
                return f.key === key;
            });

            if (source[key] !== undefined && source[key] !== null) {
                return String(source[key]);
            }

            var aliases = (field ? field.aliases : []).map(function (name) {
                return name.toLowerCase().replace(/[^a-z0-9]/g, "");
            });

            var keys = Object.keys(source);

            for (var i = 0; i < keys.length; i++) {
                var normalised = keys[i].toLowerCase().replace(/[^a-z0-9]/g, "");

                if (aliases.indexOf(normalised) !== -1) {
                    return source[keys[i]] == null
                        ? ""
                        : String(source[keys[i]]);
                }
            }

            return "";
        }

        _normaliseOptions(options) {
            if (!Array.isArray(options)) {
                return [];
            }

            var result = [];

            options.forEach(function (item) {
                var value;
                var label;

                if (item !== null && typeof item === "object") {
                    value = item.value;

                    if (value === undefined) value = item.id;
                    if (value === undefined) value = item.key;
                    if (value === undefined) value = item.description;

                    label = item.label;

                    if (label === undefined) label = item.description;
                    if (label === undefined) label = value;
                } else {
                    value = item;
                    label = item;
                }

                if (value !== undefined && value !== null) {
                    result.push({
                        value: String(value),
                        label: String(label == null ? value : label)
                    });
                }
            });

            return result;
        }

        _normaliseRow(source) {
            source = source || {};

            var id = source.assetId;

            if (id === undefined) id = source.id;
            if (id === undefined) id = source.AHC_ASSET;
            if (id === undefined) id = source.ID;
            if (id === undefined) id = source.memberId;

            var row = {
                assetId: id == null ? "" : String(id),
                selected: false,
                isModified: false,
                _original: {},
                _rowOptions: {}
            };

            FIELDS.forEach((field) => {
                row[field.key] = this._readField(source, field.key);
                row._original[field.key] = row[field.key];
            });

            DROPDOWN_FIELDS.forEach((key) => {
                row._rowOptions[key] = null;
            });

            return row;
        }

        /* =====================================================
           SEARCH AND PAGINATION
           ===================================================== */

        _matches(row) {
            if (!this._query) {
                return true;
            }

            var query = this._query.toLowerCase();

            return [
                row.assetId,
                row.description,
                row.company,
                row.costCenter,
                row.assetClass,
                row.capitalizedMonth,
                row.additionalDescription
            ].some(function (value) {
                return String(value == null ? "" : value)
                    .toLowerCase()
                    .indexOf(query) !== -1;
            });
        }

        _visibleRows() {
            return this._rows
                .map(function (row, index) {
                    return { row: row, index: index };
                })
                .filter((entry) => this._matches(entry.row));
        }

        _pageCount() {
            return Math.max(
                1,
                Math.ceil(this._visibleRows().length / this._pageSize)
            );
        }

        /* =====================================================
           DROPDOWN OPTION HELPERS
           ===================================================== */

        _getRowOptions(row, key) {
            var rowOptions = row._rowOptions[key];

            if (rowOptions !== null && rowOptions !== undefined) {
                return rowOptions;
            }

            return this._options[key] || [];
        }

        _buildDropdown(row, field, index) {
            var self = this;
            var select = document.createElement("select");

            select.className = "cell";
            select.setAttribute(
                "aria-label",
                field.label + " for " + row.assetId
            );

            var options = this._getRowOptions(row, field.key);
            var currentValue = String(row[field.key] == null ? "" : row[field.key]);

            var hasCurrentValue = options.some(function (option) {
                return option.value === currentValue;
            });

            /*
             * Retain the current member property even if it was not
             * included in the supplied dropdown options.
             */
            var renderOptions = options.slice();

            if (currentValue && !hasCurrentValue) {
                renderOptions.unshift({
                    value: currentValue,
                    label: currentValue
                });
            }

            /*
             * If there is no current value and no option, show an
             * empty selection until options are supplied.
             */
            if (!currentValue && renderOptions.length === 0) {
                renderOptions.push({
                    value: "",
                    label: "-- Select --"
                });
            }

            renderOptions.forEach(function (item) {
                var option = document.createElement("option");

                option.value = item.value;
                option.textContent = item.label;

                select.appendChild(option);
            });

            select.value = currentValue;

            select.onchange = function () {
                row[field.key] = select.value;
                self._updateModified(row);
                self._render();

                self._fire(
                    "onDataChange",
                    "fieldChange|" + index + "|" +
                    field.key + "|" + select.value
                );
            };

            return select;
        }

        _updateModified(row) {
            row.isModified = FIELDS.some(function (field) {
                return String(row[field.key] == null ? "" : row[field.key]) !==
                    String(row._original[field.key] == null ? "" : row._original[field.key]);
            });
        }

        /* =====================================================
           RENDER TABLE
           ===================================================== */

        _render() {
            var self = this;

            var head = this.shadowRoot.getElementById("headRow");
            var body = this.shadowRoot.getElementById("bodyRows");

            head.innerHTML =
                '<th class="check-cell">' +
                    '<div class="sel-head">' +
                        '<span>Sel</span>' +
                        '<input id="selectAll" type="checkbox" aria-label="Select all rows">' +
                    '</div>' +
                '</th>' +
                '<th style="width:210px">Asset ID</th>' +

                FIELDS.map(function (field) {
                    return '<th style="width:' + field.width + 'px">' +
                        field.label + '</th>';
                }).join("");

            body.innerHTML = "";

            var visible = this._visibleRows();
            var start = this._page * this._pageSize;

            var pageRows = visible.slice(start, start + this._pageSize);

            if (!pageRows.length) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");

                td.colSpan = FIELDS.length + 2;
                td.className = "empty";
                td.textContent = this._loaded
                    ? "No assets match the current search."
                    : "Click Load Data to retrieve existing assets.";

                tr.appendChild(td);
                body.appendChild(tr);

            } else {
                pageRows.forEach(function (entry) {
                    body.appendChild(self._buildRow(entry.row, entry.index));
                });
            }

            var selectAll = this.shadowRoot.getElementById("selectAll");

            var selectedVisible = pageRows.filter(function (entry) {
                return entry.row.selected;
            }).length;

            selectAll.checked =
                pageRows.length > 0 &&
                selectedVisible === pageRows.length;

            selectAll.indeterminate =
                selectedVisible > 0 &&
                selectedVisible < pageRows.length;

            selectAll.onchange = function () {
                pageRows.forEach(function (entry) {
                    entry.row.selected = selectAll.checked;
                });

                self._render();

                self._fire(
                    "onDataChange",
                    "selectionChanged|" + self._selectedRows().length
                );
            };

            var first = visible.length ? start + 1 : 0;
            var last = Math.min(start + this._pageSize, visible.length);

            this.shadowRoot.getElementById("visibleCount").textContent =
                "Visible: " + visible.length;

            this.shadowRoot.getElementById("showing").textContent =
                "Showing " + first + " to " + last + " of " + visible.length;

            this.shadowRoot.getElementById("pageLabel").textContent =
                "Page " + (this._page + 1) + " of " + this._pageCount();

            this.shadowRoot.getElementById("prevBtn").disabled = this._page <= 0;
            this.shadowRoot.getElementById("nextBtn").disabled =
                this._page >= this._pageCount() - 1;

            this.shadowRoot.getElementById("total").textContent =
                this._rows.length;

            this.shadowRoot.getElementById("selected").textContent =
                this._selectedRows().length;

            this.shadowRoot.getElementById("modified").textContent =
                this._rows.filter(function (row) {
                    return row.isModified;
                }).length;

            this.shadowRoot.getElementById("deleteBtn").style.display =
                this._selectedRows().length ? "inline-flex" : "none";
        }

        _buildRow(row, index) {
            var self = this;
            var tr = document.createElement("tr");

            if (row.selected) {
                tr.classList.add("selected");
            }

            /* SELECTION CHECKBOX */

            var tdCheck = document.createElement("td");
            tdCheck.className = "check-cell";

            var check = document.createElement("input");
            check.type = "checkbox";
            check.checked = !!row.selected;

            check.setAttribute(
                "aria-label",
                "Select asset " + row.assetId
            );

            check.onchange = function () {
                row.selected = check.checked;
                self._render();

                self._fire(
                    "onDataChange",
                    "selectRow|" + index + "|" + row.selected
                );
            };

            tdCheck.appendChild(check);
            tr.appendChild(tdCheck);

            /* ASSET ID - READ ONLY */

            var idTd = document.createElement("td");
            idTd.className = "asset-id";

            var idBox = document.createElement("div");
            idBox.className = "ro";
            idBox.title = row.assetId;
            idBox.textContent = row.assetId;

            idTd.appendChild(idBox);
            tr.appendChild(idTd);

            /* FIELD CONTROLS */

            FIELDS.forEach(function (field) {
                var td = document.createElement("td");

                if (field.key === "additionalDescription") {
                    /*
                     * ONLY THIS FIELD IS A FREE-TEXT INPUT.
                     */
                    var input = document.createElement("input");

                    input.className = "cell";
                    input.type = "text";
                    input.value = row.additionalDescription || "";
                    input.placeholder = "Enter additional description...";
                    input.title = input.value;

                    input.setAttribute(
                        "aria-label",
                        field.label + " for " + row.assetId
                    );

                    input.onchange = function () {
                        row.additionalDescription = input.value;
                        self._updateModified(row);
                        self._render();

                        self._fire(
                            "onDataChange",
                            "fieldChange|" + index +
                            "|additionalDescription|" + input.value
                        );
                    };

                    td.appendChild(input);

                } else {
                    /*
                     * DESCRIPTION, COMPANY, COST CENTER,
                     * ASSET CLASS AND CAPITALIZED MONTH ARE DROPDOWNS.
                     */
                    td.appendChild(
                        self._buildDropdown(row, field, index)
                    );
                }

                tr.appendChild(td);
            });

            return tr;
        }

        _selectedRows() {
            return this._rows.filter(function (row) {
                return row.selected;
            });
        }

        /* =====================================================
           PUBLIC API FOR SAC STORY SCRIPTING
           ===================================================== */

        getLastEvent() {
            return this._lastEvent;
        }

        getData() {
            return JSON.stringify(
                this._rows.map(function (row) {
                    return {
                        assetId: row.assetId,
                        description: row.description,
                        company: row.company,
                        costCenter: row.costCenter,
                        assetClass: row.assetClass,
                        capitalizedMonth: row.capitalizedMonth,
                        additionalDescription: row.additionalDescription,
                        selected: row.selected,
                        isModified: row.isModified
                    };
                })
            );
        }

        setData(raw) {
            var parsed;

            try {
                parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            } catch (e) {
                this._message("Unable to parse asset data.");
                return;
            }

            if (!Array.isArray(parsed)) {
                this._message("Expected a JSON array of assets.");
                return;
            }

            this._rows = parsed.map((item) => this._normaliseRow(item));
            this._loaded = true;
            this._page = 0;

            this._message("Loaded " + this._rows.length + " row(s).");
            this._render();
        }

        /*
         * Set options for a dropdown globally.
         *
         * Examples:
         * setOptions("company", ["100", "200", "300"])
         * setOptions("assetClass", ["5500", "7000"])
         *
         * Object options may use {value:"100", label:"100 - Company"}.
         */
        setOptions(fieldName, options) {
            if (DROPDOWN_FIELDS.indexOf(fieldName) === -1) {
                return;
            }

            this._options[fieldName] = this._normaliseOptions(options);
            this._render();
        }

        /*
         * Set dropdown options for one row only.
         * rowIndex is the index in the complete data array, not the
         * visible page index.
         */
        setRowOptions(rowIndex, fieldName, options) {
            if (!this._rows[rowIndex]) {
                return;
            }

            if (DROPDOWN_FIELDS.indexOf(fieldName) === -1) {
                return;
            }

            this._rows[rowIndex]._rowOptions[fieldName] =
                this._normaliseOptions(options);

            this._render();
        }

        setCellValue(rowIndex, fieldName, value) {
            if (!this._rows[rowIndex]) {
                return;
            }

            if (!FIELDS.some(function (field) {
                return field.key === fieldName;
            })) {
                return;
            }

            this._rows[rowIndex][fieldName] =
                value == null ? "" : String(value);

            this._updateModified(this._rows[rowIndex]);
            this._render();
        }

        getSelectedData() {
            return JSON.stringify(
                this._selectedRows().map(function (row) {
                    return {
                        assetId: row.assetId,
                        description: row.description,
                        company: row.company,
                        costCenter: row.costCenter,
                        assetClass: row.assetClass,
                        capitalizedMonth: row.capitalizedMonth,
                        additionalDescription: row.additionalDescription,
                        isModified: row.isModified
                    };
                })
            );
        }

        getModifiedData() {
            return JSON.stringify(
                this._rows.filter(function (row) {
                    return row.isModified;
                }).map(function (row) {
                    return {
                        assetId: row.assetId,
                        description: row.description,
                        company: row.company,
                        costCenter: row.costCenter,
                        assetClass: row.assetClass,
                        capitalizedMonth: row.capitalizedMonth,
                        additionalDescription: row.additionalDescription
                    };
                })
            );
        }

        markSaved() {
            this._rows.forEach(function (row) {
                FIELDS.forEach(function (field) {
                    row._original[field.key] = row[field.key];
                });

                row.isModified = false;
            });

            this._message("Changes saved.");
            this._render();
        }

        removeRowsById(rawIds) {
            var ids;

            try {
                ids = Array.isArray(rawIds) ? rawIds : JSON.parse(rawIds);
            } catch (e) {
                this._message("Unable to parse asset IDs.");
                return;
            }

            if (!Array.isArray(ids)) {
                return;
            }

            var idSet = new Set(ids.map(String));

            this._rows = this._rows.filter(function (row) {
                return !idSet.has(String(row.assetId));
            });

            this._page = Math.min(this._page, this._pageCount() - 1);

            this._message(
                "Widget rows updated. Model deletion must be confirmed separately."
            );

            this._render();
        }

        clearData() {
            this._rows = [];
            this._page = 0;
            this._query = "";
            this._loaded = false;

            var search = this.shadowRoot.getElementById("search");

            if (search) {
                search.value = "";
            }

            this._message("Widget cleared. No model data was changed.");
            this._render();
        }

        setStatus(message) {
            this._message(message);
        }
    }

    /* =========================================================
       UNIQUE COMPONENT REGISTRATION
       ========================================================= */

    if (!customElements.get("com-madhav-modifyasset")) {
        customElements.define("com-madhav-modifyasset", ModifyAsset);
    }

})();
