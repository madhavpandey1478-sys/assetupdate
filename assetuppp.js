
(function () {
  "use strict";

  /* =========================================================
     MODIFY ASSET - STANDALONE SAC CUSTOM WIDGET
     Component tag: com-madhav-modifyasset

     Read-only: Asset ID
     Editable text: Description, Asset Additional Description
     Dropdowns: Company, Cost Center, Asset Class
     Month picker: Capitalized Month

     Model updates/deletion are performed by SAC story scripting.
     ========================================================= */

  var FIELDS = [
    { key: "description", label: "Description", width: 260, text: true },
    { key: "company", label: "Company", width: 180 },
    { key: "costCenter", label: "Cost Center", width: 190 },
    { key: "assetClass", label: "Asset Class", width: 180 },
    { key: "capitalizedMonth", label: "Capitalized Month", width: 200, month: true },
    { key: "additionalDescription", label: "Asset Additional Description", width: 320, text: true }
  ];

  var STYLE = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 220px;
      font-family: "72", "72full", Arial, sans-serif;
      color: #17365d;
      box-sizing: border-box;
      background: #fff;
    }

    * {
      box-sizing: border-box;
    }

    .root {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 220px;
      background: #fff;
      border: 1px solid #d7e1ef;
      border-radius: 4px;
      overflow: hidden;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      min-height: 62px;
      padding: 10px 12px;
      background: #f7faff;
      border-bottom: 1px solid #dce6f2;
    }

    .search {
      height: 38px;
      width: 286px;
      max-width: 28%;
      min-width: 180px;
      flex: 0 1 286px;
      padding: 0 12px;
      border: 1px solid #cbd9eb;
      border-radius: 7px;
      background: #fff;
      color: #17365d;
      font: 13px "72", Arial, sans-serif;
      outline: none;
    }

    .search::placeholder {
      color: #70829a;
    }

    .search:focus {
      border-color: #0a6ed1;
      box-shadow: 0 0 0 2px #0a6ed11f;
    }

    #visibleCount {
      font-size: 12px;
      color: #58708e;
      white-space: nowrap;
      margin-right: 8px;
    }

    .spacer {
      flex: 1;
      min-width: 8px;
    }

    button {
      height: 34px;
      min-width: 68px;
      padding: 0 14px;
      border: 1px solid #c9d9ef;
      border-radius: 7px;
      background: #fff;
      color: #0866d6;
      font: 600 12px "72", Arial, sans-serif;
      cursor: pointer;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    button:hover {
      background: #f0f6ff;
      border-color: #a9c8f1;
    }

    button:focus-visible {
      outline: 2px solid #0a6ed1;
      outline-offset: 1px;
    }

    button:disabled {
      opacity: .45;
      cursor: default;
    }

    button.primary {
      background: #0866d6;
      border-color: #0866d6;
      color: #fff;
    }

    button.primary:hover {
      background: #0758b8;
    }

    button.delete {
      display: none;
      color: #c00000;
      border-color: #e8baba;
      background: #fff;
    }

    button.delete:hover {
      background: #fff5f5;
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 9px;
      flex-wrap: nowrap;
      min-height: 48px;
      padding: 7px 12px;
      border-bottom: 1px solid #e0e8f2;
      background: #fff;
      color: #5f7390;
      font-size: 12px;
    }

    .paging button {
      height: 32px;
      min-width: 70px;
      padding: 0 12px;
    }

    #showing,
    #pageLabel {
      white-space: nowrap;
    }

    .table-wrap {
      flex: 1;
      min-height: 100px;
      overflow: auto;
      background: #fff;
    }

    table {
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;
      min-width: 1650px;
      width: 100%;
    }

    th {
      position: sticky;
      top: 0;
      z-index: 2;
      height: 42px;
      padding: 0 10px;
      background: #edf3fb;
      color: #17365d;
      border-bottom: 1px solid #d8e3f1;
      font-size: 12px;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
    }

    td {
      height: 51px;
      padding: 6px 8px;
      border-bottom: 1px solid #e2eaf4;
      background: #fff;
      vertical-align: middle;
    }

    tr:hover td {
      background: #fbfdff;
    }

    tr.selected td {
      background: #fff9e9;
    }

    tr.selected:hover td {
      background: #fff5dc;
    }

    .check-cell {
      width: 54px;
      min-width: 54px;
      text-align: center;
      padding: 0;
    }

    input[type=checkbox] {
      width: 18px;
      height: 18px;
      accent-color: #0875e1;
      cursor: pointer;
      vertical-align: middle;
    }

    .asset-id {
      height: 34px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      background: #f4f7fb;
      border: 1px solid #d5e0ef;
      border-radius: 6px;
      font-size: 12px;
      color: #46617f;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cell {
      width: 100%;
      min-width: 0;
      height: 35px;
      padding: 0 10px;
      border: 1px solid #cbd9eb;
      border-radius: 6px;
      background: #fff;
      color: #17365d;
      font: 12px "72", Arial, sans-serif;
      outline: none;
    }

    select.cell {
      padding-right: 24px;
      cursor: pointer;
    }

    input.cell {
      padding-right: 9px;
    }

    input[type=month].cell {
      color: #47617f;
    }

    .cell:focus {
      border-color: #0875e1;
      box-shadow: 0 0 0 1px #0875e133;
    }

    .empty {
      height: 70px;
      padding: 25px;
      text-align: center;
      color: #7489a3;
      font-size: 13px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      min-height: 34px;
      padding: 7px 10px;
      background: #f7faff;
      border-top: 1px solid #dce6f2;
      color: #617895;
      font-size: 11px;
    }

    .strong {
      color: #17365d;
      font-weight: 700;
    }

    .message {
      margin-left: auto;
      white-space: normal;
    }

    @media(max-width: 1000px) {
      .toolbar {
        flex-wrap: wrap;
      }

      .search {
        max-width: none;
      }

      .spacer {
        flex: 1;
      }

      .paging {
        flex-wrap: wrap;
      }

      .message {
        margin-left: 0;
      }
    }
  `;

  var template = document.createElement("template");

  template.innerHTML =
    '<style>' + STYLE + '</style>' +
    '<div class="root">' +
      '<div class="toolbar">' +
        '<input id="search" class="search" type="search" placeholder="Search Asset ID or Description..." aria-label="Search assets">' +
        '<span id="visibleCount">Visible: 0</span>' +
        '<span class="spacer"></span>' +
        '<button id="loadBtn">Load Data</button>' +
        '<button id="saveBtn" class="primary">Save Changes</button>' +
        '<button id="deleteBtn" class="delete">Delete Selected</button>' +
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
        '<span class="message" id="message">Click Load Data to begin.</span>' +
      '</div>' +
    '</div>';

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
      this._options = {};
      this._rowOptions = {};

      FIELDS.forEach((field) => {
        this._options[field.key] = [];
      });

      this._bind();
      this._render();
    }

    connectedCallback() {
      this._fire("onReady", "ready");
    }

    _bind() {
      var self = this;

      this.shadowRoot.getElementById("loadBtn").onclick = function () {
        self._message("Loading existing assets...");
        self._fire("onDataChange", "loadData");
      };

      this.shadowRoot.getElementById("saveBtn").onclick = function () {
        var count = self._rows.filter(function (row) {
          return row.isModified;
        }).length;

        self._fire("onDataChange", "saveChanges|" + count);

        if (count === 0) {
          self._message("No changes to save.");
        }
      };

      this.shadowRoot.getElementById("deleteBtn").onclick = function () {
        var count = self._selectedRows().length;

        if (count > 0) {
          self._fire("onDataChange", "deleteSelected|" + count);
        }
      };

      this.shadowRoot.getElementById("clearBtn").onclick = function () {
        self.clearData();
        self._fire("onDataChange", "clear");
      };

      this.shadowRoot.getElementById("search").oninput = function (event) {
        self._query = event.target.value || "";
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

    _parseOptions(raw) {
      var parsed = raw;

      if (typeof raw === "string") {
        try {
          parsed = JSON.parse(raw);
        } catch (error) {
          parsed = [];
        }
      }

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(function (item) {
        if (item && typeof item === "object") {
          var value = item.value !== undefined ? item.value : item.id;

          var text = item.text !== undefined
            ? item.text
            : (item.description !== undefined ? item.description : value);

          return {
            value: value == null ? "" : String(value),
            text: text == null ? "" : String(text)
          };
        }

        return {
          value: item == null ? "" : String(item),
          text: item == null ? "" : String(item)
        };
      });
    }

    _readField(source, key) {
      var aliases = {
        description: [
          "description",
          "assetDescription",
          "ASSET_DESCRIPTION",
          "DESCRIPTION",
          "TEXT"
        ],
        company: [
          "company",
          "COMPANY",
          "COMPANY_CODE",
          "COMPANYCODE"
        ],
        costCenter: [
          "costCenter",
          "COSTCENTER",
          "COST_CENTER",
          "COST CENTER"
        ],
        assetClass: [
          "assetClass",
          "ASSET_CLASS",
          "ASSETCLASS",
          "ASSET CLASS"
        ],
        capitalizedMonth: [
          "capitalizedMonth",
          "CAPITALIZED",
          "CAPITALIZED_MONTH",
          "CAPITALIZEDMONTH",
          "CWIP_T_MONTH"
        ],
        additionalDescription: [
          "additionalDescription",
          "ASSET_ADDITIONAL_DESCRIPTION",
          "ASSET ADDITIONAL DESCRIPTION"
        ]
      };

      if (source[key] !== undefined && source[key] !== null) {
        return String(source[key]);
      }

      var allKeys = Object.keys(source);

      var normal = (aliases[key] || [key]).map(function (value) {
        return value.toLowerCase().replace(/[^a-z0-9]/g, "");
      });

      for (var i = 0; i < allKeys.length; i++) {
        var normalizedKey = allKeys[i]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        if (normal.indexOf(normalizedKey) >= 0) {
          return source[allKeys[i]] == null
            ? ""
            : String(source[allKeys[i]]);
        }
      }

      return "";
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
        selected: !!source.selected,
        isModified: false,
        _original: {}
      };

      FIELDS.forEach((field) => {
        row[field.key] = this._readField(source, field.key);
        row._original[field.key] = row[field.key];
      });

      return row;
    }

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
          .indexOf(query) >= 0;
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

    _selectedRows() {
      return this._rows.filter(function (row) {
        return row.selected;
      });
    }

    _isModified(row) {
      return FIELDS.some(function (field) {
        return String(row[field.key] == null ? "" : row[field.key]) !==
          String(row._original[field.key] == null ? "" : row._original[field.key]);
      });
    }

    _render() {
      var self = this;

      var head = this.shadowRoot.getElementById("headRow");
      var body = this.shadowRoot.getElementById("bodyRows");

      head.innerHTML =
        '<th class="check-cell">' +
          '<input id="selectAll" type="checkbox" aria-label="Select all visible rows">' +
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

      if (pageRows.length === 0) {
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

      this.shadowRoot.getElementById("visibleCount").textContent =
        "Visible: " + visible.length;

      this.shadowRoot.getElementById("showing").textContent =
        "Showing " +
        (visible.length ? start + 1 : 0) +
        " to " +
        Math.min(start + this._pageSize, visible.length) +
        " of " +
        visible.length;

      this.shadowRoot.getElementById("pageLabel").textContent =
        "Page " + (this._page + 1) + " of " + this._pageCount();

      this.shadowRoot.getElementById("prevBtn").disabled =
        this._page <= 0;

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

      var tdCheck = document.createElement("td");
      tdCheck.className = "check-cell";

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = !!row.selected;
      check.setAttribute("aria-label", "Select asset " + row.assetId);

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

      var idTd = document.createElement("td");
      var idBox = document.createElement("div");

      idBox.className = "asset-id";
      idBox.title = row.assetId;
      idBox.textContent = row.assetId;

      idTd.appendChild(idBox);
      tr.appendChild(idTd);

      FIELDS.forEach(function (field) {
        var td = document.createElement("td");
        var input;

        if (field.text || field.month) {
          input = document.createElement("input");

          input.type = field.month ? "month" : "text";
          input.value = row[field.key] == null ? "" : row[field.key];

          if (field.month && input.value.length >= 7) {
            input.value = input.value.substring(0, 7);
          }

          if (field.text) {
            input.placeholder =
              field.key === "description"
                ? "Enter description..."
                : "Enter additional description...";
          }
        } else {
          input = document.createElement("select");

          var options =
            (self._rowOptions[index] &&
              self._rowOptions[index][field.key]) ||
            self._options[field.key] ||
            [];

          var blank = document.createElement("option");
          blank.value = "";
          blank.textContent = "Select...";
          input.appendChild(blank);

          options.forEach(function (optionData) {
            var option = document.createElement("option");
            option.value = optionData.value;
            option.textContent = optionData.text;
            input.appendChild(option);
          });

          input.value = row[field.key] == null ? "" : row[field.key];

          if (
            input.value !== "" &&
            !options.some(function (optionData) {
              return optionData.value === input.value;
            })
          ) {
            var current = document.createElement("option");
            current.value = input.value;
            current.textContent = input.value;

            input.insertBefore(current, input.children[1] || null);
            input.value = row[field.key];
          }
        }

        input.className = "cell";
        input.title = row[field.key] == null ? "" : row[field.key];

        input.setAttribute(
          "aria-label",
          field.label + " for " + row.assetId
        );

        input.onchange = function () {
          row[field.key] = input.value;
          row.isModified = self._isModified(row);

          self._render();

          self._fire(
            "onDataChange",
            "fieldChange|" + index + "|" +
            field.key + "|" + input.value
          );
        };

        td.appendChild(input);
        tr.appendChild(td);
      });

      return tr;
    }

    /* =========================================================
       PUBLIC METHODS EXPOSED TO SAC STORY SCRIPTING
       ========================================================= */

    getLastEvent() {
      return this._lastEvent;
    }

    setData(raw) {
      var parsed = raw;

      try {
        if (typeof raw === "string") {
          parsed = JSON.parse(raw);
        }
      } catch (error) {
        this._message("Unable to parse asset data. Expected a JSON array.");
        return;
      }

      if (!Array.isArray(parsed)) {
        this._message("Unable to load data: expected a JSON array.");
        return;
      }

      this._rows = parsed.map((item) => this._normaliseRow(item));
      this._loaded = true;
      this._page = 0;

      this._message("Loaded " + this._rows.length + " asset(s).");
      this._render();
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

    setOptions(fieldName, rawOptions) {
      if (!Object.prototype.hasOwnProperty.call(this._options, fieldName)) {
        return;
      }

      this._options[fieldName] = this._parseOptions(rawOptions);
      this._render();
    }

    setRowOptions(rowIndex, fieldName, rawOptions) {
      if (!Object.prototype.hasOwnProperty.call(this._options, fieldName)) {
        return;
      }

      if (!this._rowOptions[rowIndex]) {
        this._rowOptions[rowIndex] = {};
      }

      this._rowOptions[rowIndex][fieldName] = this._parseOptions(rawOptions);
      this._render();
    }

    setCellValue(rowIndex, fieldName, value) {
      if (
        !this._rows[rowIndex] ||
        !FIELDS.some(function (field) {
          return field.key === fieldName;
        })
      ) {
        return;
      }

      var row = this._rows[rowIndex];

      row[fieldName] = value == null ? "" : String(value);
      row.isModified = this._isModified(row);

      this._render();
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
      var ids = rawIds;

      try {
        if (typeof rawIds === "string") {
          ids = JSON.parse(rawIds);
        }
      } catch (error) {
        this._message("Could not parse deleted asset IDs.");
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

      this._message("Deleted rows removed from widget view.");
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

  if (!customElements.get("com-madhav-modifyasset")) {
    customElements.define("com-madhav-modifyasset", ModifyAsset);
  }
})();
