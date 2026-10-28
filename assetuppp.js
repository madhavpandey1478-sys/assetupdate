
(function () {
  "use strict";

  // =========================================================
  // MODIFY ASSET - SAC CUSTOM WIDGET
  // =========================================================

  var FIELDS = [
    { key: "description", label: "Description", width: 260, text: true },
    { key: "company", label: "Company", width: 180 },
    { key: "costCenter", label: "Cost Center", width: 190 },
    { key: "assetClass", label: "Asset Class", width: 180 },
    { key: "additionalDescription", label: "Asset Additional Description", width: 320, text: true },
    { key: "capitalizedMonth", label: "Capitalized Month", width: 200, month: true }
  ];

  var STYLE = `
    :host {
      display:block;width:100%;height:100%;min-height:220px;
      font-family:"72","72full",Arial,sans-serif;color:#17365d;
      box-sizing:border-box;background:#fff;
    }
    * { box-sizing:border-box; }
    .root {
      display:flex;flex-direction:column;width:100%;height:100%;
      min-height:220px;background:#fff;border:1px solid #d7e1ef;
      border-radius:4px;overflow:hidden;
    }
    .toolbar {
      display:flex;align-items:center;gap:8px;flex-wrap:wrap;
      min-height:62px;padding:10px 12px;background:#f7faff;
      border-bottom:1px solid #dce6f2;
    }
    .search {
      height:38px;width:286px;max-width:28%;min-width:180px;
      padding:0 12px;border:1px solid #cbd9eb;border-radius:7px;
      background:#fff;color:#17365d;font:13px "72",Arial,sans-serif;
      outline:none;
    }
    .search:focus { border-color:#0a6ed1; }
    #visibleCount { font-size:12px;color:#58708e;white-space:nowrap; }
    .spacer { flex:1;min-width:8px; }
    button {
      height:34px;min-width:68px;padding:0 14px;
      border:1px solid #c9d9ef;border-radius:7px;background:#fff;
      color:#0866d6;font:600 12px "72",Arial,sans-serif;
      cursor:pointer;white-space:nowrap;
      display:inline-flex;align-items:center;justify-content:center;
    }
    button:hover { background:#f0f6ff; }
    button:disabled { opacity:.45;cursor:default; }
    button.primary { background:#0866d6;border-color:#0866d6;color:#fff; }
    button.primary:hover { background:#0758b8; }
    button.delete { display:none;color:#c00000;border-color:#e8baba; }
    .paging {
      display:flex;align-items:center;justify-content:flex-end;gap:9px;
      flex-wrap:wrap;min-height:48px;padding:7px 12px;
      border-bottom:1px solid #e0e8f2;background:#fff;
      color:#5f7390;font-size:12px;
    }
    .paging button { height:32px;min-width:70px;padding:0 12px; }
    #showing,#pageLabel { white-space:nowrap; }
    .table-wrap { flex:1;min-height:100px;overflow:auto;background:#fff; }
    table {
      border-collapse:separate;border-spacing:0;table-layout:fixed;
      min-width:1650px;width:100%;
    }
    th {
      position:sticky;top:0;z-index:2;height:42px;padding:0 10px;
      background:#edf3fb;color:#17365d;border-bottom:1px solid #d8e3f1;
      font-size:12px;font-weight:700;text-align:left;white-space:nowrap;
    }
    td {
      height:51px;padding:6px 8px;border-bottom:1px solid #e2eaf4;
      background:#fff;vertical-align:middle;
    }
    tr:hover td { background:#fbfdff; }
    tr.selected td { background:#fff9e9; }
    .check-cell { width:54px;min-width:54px;text-align:center;padding:0; }
    input[type=checkbox] { width:18px;height:18px;accent-color:#0875e1;cursor:pointer; }
    .asset-id {
      height:34px;display:flex;align-items:center;padding:0 10px;
      background:#f4f7fb;border:1px solid #d5e0ef;border-radius:6px;
      font-size:12px;color:#46617f;white-space:nowrap;overflow:hidden;
      text-overflow:ellipsis;
    }
    .cell {
      width:100%;min-width:0;height:35px;padding:0 10px;
      border:1px solid #cbd9eb;border-radius:6px;background:#fff;
      color:#17365d;font:12px "72",Arial,sans-serif;outline:none;
    }
    .cell:focus { border-color:#0875e1;box-shadow:0 0 0 1px #0875e133; }
    .empty { height:70px;padding:25px;text-align:center;color:#7489a3;font-size:13px; }
    .status {
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;
      min-height:34px;padding:7px 10px;background:#f7faff;
      border-top:1px solid #dce6f2;color:#617895;font-size:11px;
    }
    .strong { color:#17365d;font-weight:700; }
    .message { margin-left:auto;white-space:normal; }

    /* Searchable dropdown */
    .dropdown { position:relative;width:100%;min-width:0; }
    .dropdown-trigger {
      display:flex;align-items:center;justify-content:space-between;gap:8px;
      width:100%;height:35px;padding:0 10px;border:1px solid #cbd9eb;
      border-radius:6px;background:#fff;color:#17365d;
      font:12px "72",Arial,sans-serif;text-align:left;cursor:pointer;
    }
    .dropdown-trigger:hover,.dropdown.open .dropdown-trigger { border-color:#0875e1; }
    .dropdown-value { overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:1; }
    .dropdown-arrow { flex:0 0 auto;color:#64809f; }
    .dropdown-panel {
      display:none;position:absolute;top:calc(100% + 3px);left:0;
      width:max(100%,300px);min-width:100%;max-width:440px;z-index:1000;
      padding:8px;background:#fff;border:1px solid #cbd9eb;
      border-radius:7px;box-shadow:0 5px 18px #17365d26;
    }
    .dropdown.open .dropdown-panel { display:block; }
    .dropdown-search {
      width:100%;height:34px;margin-bottom:6px;padding:0 10px;
      border:1px solid #cbd9eb;border-radius:5px;outline:none;
      font:12px "72",Arial,sans-serif;
    }
    .dropdown-search:focus { border-color:#0875e1; }
    .dropdown-options { max-height:240px;overflow-y:auto;overscroll-behavior:contain; }
    .dropdown-option {
      display:block;width:100%;min-width:0;height:auto;min-height:35px;
      padding:9px 8px;border:0;border-bottom:1px solid #edf1f6;
      border-radius:0;background:#fff;color:#17365d;
      font:12px "72",Arial,sans-serif;text-align:left;
      white-space:normal;overflow-wrap:anywhere;justify-content:flex-start;
    }
    .dropdown-option:hover { background:#f0f6ff; }
    .dropdown-option.active { background:#e8f2ff;font-weight:700; }
    .dropdown-no-results { padding:12px 8px;color:#7489a3;font-size:12px; }

    /* Custom month/year picker */
    .month-picker { position:relative;width:100%; }
    .month-trigger {
      display:flex;align-items:center;justify-content:space-between;gap:8px;
      width:100%;height:35px;padding:0 10px;border:1px solid #cbd9eb;
      border-radius:6px;background:#fff;color:#17365d;
      font:12px "72",Arial,sans-serif;cursor:pointer;
    }
    .month-panel {
      display:none;position:absolute;z-index:2000;right:0;top:calc(100% + 4px);
      width:250px;padding:10px;border:1px solid #cbd9eb;border-radius:9px;
      background:#fff;box-shadow:0 5px 18px #17365d30;
    }
    .month-picker.open .month-panel { display:block; }
    .month-year-row { display:flex;align-items:center;gap:8px;margin-bottom:12px; }
    .month-year {
      flex:1;height:34px;padding:0 8px;border:1px solid #cbd9eb;
      border-radius:6px;background:#fff;color:#17365d;font:13px "72",Arial,sans-serif;
    }
    .month-close-x {
      min-width:30px;width:30px;height:30px;padding:0;border:0;
      color:#667991;background:transparent;font-size:18px;
    }
    .month-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px; }
    .month-option {
      min-width:0;width:100%;height:34px;padding:0 3px;
      border:1px solid #cbd9eb;border-radius:6px;background:#fff;
      color:#17365d;font:12px "72",Arial,sans-serif;
    }
    .month-option:hover { background:#eef5ff;border-color:#9cbfea; }
    .month-option.active { background:#0866d6;color:#fff;border-color:#0866d6; }
    .month-footer {
      display:flex;justify-content:space-between;align-items:center;gap:8px;
      margin-top:12px;padding-top:8px;border-top:1px solid #edf1f6;
    }
    .month-footer button {
      min-width:0;height:27px;padding:0 3px;border:0;color:#0875e1;
      background:transparent;font-size:12px;font-weight:400;
    }

    @media(max-width:1000px) {
      .toolbar { flex-wrap:wrap; }
      .search { max-width:none; }
      .paging { flex-wrap:wrap; }
      .message { margin-left:0; }
    }
  `;

  var template = document.createElement("template");
  template.innerHTML =
    "<style>" + STYLE + "</style>" +
    '<div class="root">' +
      '<div class="toolbar">' +
        '<input id="search" class="search" type="search" placeholder="Search ID or Description..." aria-label="Search assets">' +
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
        '<table><thead><tr id="headRow"></tr></thead><tbody id="bodyRows"></tbody></table>' +
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
      this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
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
        description: ["description", "assetDescription", "ASSET_DESCRIPTION", "DESCRIPTION", "TEXT"],
        company: ["company", "COMPANY", "COMPANY_CODE", "COMPANYCODE"],
        costCenter: ["costCenter", "COSTCENTER", "COST_CENTER", "COST CENTER"],
        assetClass: ["assetClass", "ASSET_CLASS", "ASSETCLASS", "ASSET CLASS"],
        capitalizedMonth: ["capitalizedMonth", "CAPITALIZED", "CAPITALIZED_MONTH", "CAPITALIZEDMONTH", "CWIP_T_MONTH"],
        additionalDescription: ["additionalDescription", "ASSET_ADDITIONAL_DESCRIPTION", "ASSET ADDITIONAL DESCRIPTION"]
      };

      if (source[key] !== undefined && source[key] !== null) {
        return String(source[key]);
      }

      var allKeys = Object.keys(source);
      var normal = (aliases[key] || [key]).map(function (value) {
        return value.toLowerCase().replace(/[^a-z0-9]/g, "");
      });

      for (var i = 0; i < allKeys.length; i++) {
        var normalizedKey = allKeys[i].toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normal.indexOf(normalizedKey) >= 0) {
          return source[allKeys[i]] == null ? "" : String(source[allKeys[i]]);
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
      if (!this._query) return true;
      var query = this._query.toLowerCase();

      return [
        row.assetId, row.description, row.company, row.costCenter,
        row.assetClass, row.capitalizedMonth, row.additionalDescription
      ].some(function (value) {
        return String(value == null ? "" : value).toLowerCase().indexOf(query) >= 0;
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
      return Math.max(1, Math.ceil(this._visibleRows().length / this._pageSize));
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

    _closePopups() {
      this.shadowRoot.querySelectorAll(".dropdown.open,.month-picker.open")
        .forEach(function (element) {
          element.classList.remove("open");
        });
    }

    _render() {
      var self = this;
      var head = this.shadowRoot.getElementById("headRow");
      var body = this.shadowRoot.getElementById("bodyRows");

      head.innerHTML =
        '<th class="check-cell"><input id="selectAll" type="checkbox" aria-label="Select all visible rows"></th>' +
        '<th style="width:210px">Asset ID</th>' +
        FIELDS.map(function (field) {
          return '<th style="width:' + field.width + 'px">' + field.label + "</th>";
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

      selectAll.checked = pageRows.length > 0 && selectedVisible === pageRows.length;
      selectAll.indeterminate = selectedVisible > 0 && selectedVisible < pageRows.length;

      selectAll.onchange = function () {
        pageRows.forEach(function (entry) {
          entry.row.selected = selectAll.checked;
        });
        self._render();
        self._fire("onDataChange", "selectionChanged|" + self._selectedRows().length);
      };

      this.shadowRoot.getElementById("visibleCount").textContent = "Visible: " + visible.length;
      this.shadowRoot.getElementById("showing").textContent =
        "Showing " + (visible.length ? start + 1 : 0) +
        " to " + Math.min(start + this._pageSize, visible.length) +
        " of " + visible.length;

      this.shadowRoot.getElementById("pageLabel").textContent =
        "Page " + (this._page + 1) + " of " + this._pageCount();

      this.shadowRoot.getElementById("prevBtn").disabled = this._page <= 0;
      this.shadowRoot.getElementById("nextBtn").disabled = this._page >= this._pageCount() - 1;
      this.shadowRoot.getElementById("total").textContent = this._rows.length;
      this.shadowRoot.getElementById("selected").textContent = this._selectedRows().length;
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

      if (row.selected) tr.classList.add("selected");

      var tdCheck = document.createElement("td");
      tdCheck.className = "check-cell";

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = !!row.selected;
      check.setAttribute("aria-label", "Select asset " + row.assetId);

      check.onchange = function () {
        row.selected = check.checked;
        self._render();
        self._fire("onDataChange", "selectRow|" + index + "|" + row.selected);
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

        // TEXT INPUTS
        if (field.text) {
          input = document.createElement("input");
          input.type = "text";
          input.className = "cell";
          input.value = row[field.key] == null ? "" : row[field.key];
          input.placeholder = field.key === "description"
            ? "Enter description..."
            : "Enter additional description...";
          input.title = input.value;

          input.onchange = function () {
            row[field.key] = input.value;
            row.isModified = self._isModified(row);
            self._render();
            self._fire(
              "onDataChange",
              "fieldChange|" + index + "|" + field.key + "|" + input.value
            );
          };

          td.appendChild(input);
        }

        // CUSTOM MONTH/YEAR PICKER
        else if (field.month) {
          var picker = document.createElement("div");
          picker.className = "month-picker";

          var monthTrigger = document.createElement("button");
          monthTrigger.type = "button";
          monthTrigger.className = "month-trigger";

          var monthLabel = document.createElement("span");
          var monthIcon = document.createElement("span");
          monthIcon.textContent = "▦";
          monthTrigger.appendChild(monthLabel);
          monthTrigger.appendChild(monthIcon);

          var monthPanel = document.createElement("div");
          monthPanel.className = "month-panel";

          var yearRow = document.createElement("div");
          yearRow.className = "month-year-row";

          var yearSelect = document.createElement("select");
          yearSelect.className = "month-year";

          var closeX = document.createElement("button");
          closeX.type = "button";
          closeX.className = "month-close-x";
          closeX.textContent = "×";

          yearRow.appendChild(yearSelect);
          yearRow.appendChild(closeX);

          var monthGrid = document.createElement("div");
          monthGrid.className = "month-grid";

          var footer = document.createElement("div");
          footer.className = "month-footer";

          var clearMonth = document.createElement("button");
          clearMonth.type = "button";
          clearMonth.textContent = "Clear selection";

          var closeMonth = document.createElement("button");
          closeMonth.type = "button";
          closeMonth.textContent = "Close";

          footer.appendChild(clearMonth);
          footer.appendChild(closeMonth);

          monthPanel.appendChild(yearRow);
          monthPanel.appendChild(monthGrid);
          monthPanel.appendChild(footer);

          var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];

          var fullMonthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          var currentMonthValue = String(row[field.key] || "");
          var currentYear = new Date().getFullYear();
          var selectedYear = currentMonthValue.length >= 4
            ? parseInt(currentMonthValue.substring(0, 4), 10)
            : currentYear;

          if (isNaN(selectedYear)) selectedYear = currentYear;

          for (var year = currentYear - 10; year <= currentYear + 20; year++) {
            var yearOption = document.createElement("option");
            yearOption.value = String(year);
            yearOption.textContent = String(year);
            yearSelect.appendChild(yearOption);
          }

          if (selectedYear < currentYear - 10 || selectedYear > currentYear + 20) {
            var extraYear = document.createElement("option");
            extraYear.value = String(selectedYear);
            extraYear.textContent = String(selectedYear);
            yearSelect.appendChild(extraYear);
          }

          yearSelect.value = String(selectedYear);

          function updateMonthLabel() {
            var value = String(row[field.key] || "");
            var parts = value.split("-");

            if (parts.length === 2) {
              var monthNumber = parseInt(parts[1], 10);
              if (monthNumber >= 1 && monthNumber <= 12) {
                monthLabel.textContent =
                  fullMonthNames[monthNumber - 1] + " " + parts[0];
                return;
              }
            }

            monthLabel.textContent = "Select month";
          }

          function renderMonthGrid() {
            monthGrid.innerHTML = "";

            for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
              var monthButton = document.createElement("button");
              monthButton.type = "button";
              monthButton.className = "month-option";
              monthButton.textContent = monthNames[monthIndex];

              var monthValue = yearSelect.value + "-" +
                (monthIndex + 1 < 10 ? "0" : "") +
                String(monthIndex + 1);

              if (row[field.key] === monthValue) {
                monthButton.classList.add("active");
              }

              monthButton.onclick = function (event) {
                event.stopPropagation();

                var chosenIndex = monthNames.indexOf(event.currentTarget.textContent);
                var chosenValue = yearSelect.value + "-" +
                  (chosenIndex + 1 < 10 ? "0" : "") +
                  String(chosenIndex + 1);

                row[field.key] = chosenValue;
                row.isModified = self._isModified(row);
                picker.classList.remove("open");

                self._render();
                self._fire(
                  "onDataChange",
                  "fieldChange|" + index + "|" + field.key + "|" + chosenValue
                );
              };

              monthGrid.appendChild(monthButton);
            }
          }

          monthTrigger.onclick = function (event) {
            event.stopPropagation();
            self._closePopups();
            picker.classList.add("open");
            renderMonthGrid();
          };

          yearSelect.onchange = renderMonthGrid;

          closeX.onclick = function () {
            picker.classList.remove("open");
          };

          closeMonth.onclick = function () {
            picker.classList.remove("open");
          };

          clearMonth.onclick = function () {
            row[field.key] = "";
            row.isModified = self._isModified(row);
            picker.classList.remove("open");

            self._render();
            self._fire("onDataChange", "fieldChange|" + index + "|" + field.key + "|");
          };

          updateMonthLabel();
          renderMonthGrid();

          picker.appendChild(monthTrigger);
          picker.appendChild(monthPanel);
          td.appendChild(picker);
        }

        // SEARCHABLE DROPDOWNS
        else {
          var options =
            (self._rowOptions[index] && self._rowOptions[index][field.key]) ||
            self._options[field.key] ||
            [];

          var dropdown = document.createElement("div");
          dropdown.className = "dropdown";

          var trigger = document.createElement("button");
          trigger.type = "button";
          trigger.className = "dropdown-trigger";

          var selectedLabel = document.createElement("span");
          selectedLabel.className = "dropdown-value";

          var arrow = document.createElement("span");
          arrow.className = "dropdown-arrow";
          arrow.textContent = "▾";

          var currentOption = options.find(function (option) {
            return option.value === String(row[field.key] || "");
          });

          selectedLabel.textContent = currentOption
            ? currentOption.text
            : (row[field.key] || "Select...");

          trigger.appendChild(selectedLabel);
          trigger.appendChild(arrow);

          var panel = document.createElement("div");
          panel.className = "dropdown-panel";

          var searchInput = document.createElement("input");
          searchInput.type = "search";
          searchInput.className = "dropdown-search";
          searchInput.placeholder = "Search ID or description...";

          var optionList = document.createElement("div");
          optionList.className = "dropdown-options";

          panel.appendChild(searchInput);
          panel.appendChild(optionList);

          function renderDropdownOptions(query) {
            optionList.innerHTML = "";
            var normalizedQuery = String(query || "").toLowerCase();

            var filtered = options.filter(function (option) {
              return option.value.toLowerCase().indexOf(normalizedQuery) >= 0 ||
                option.text.toLowerCase().indexOf(normalizedQuery) >= 0;
            });

            if (filtered.length === 0) {
              var empty = document.createElement("div");
              empty.className = "dropdown-no-results";
              empty.textContent = "No matching options";
              optionList.appendChild(empty);
              return;
            }

            filtered.forEach(function (optionData) {
              var optionButton = document.createElement("button");
              optionButton.type = "button";
              optionButton.className = "dropdown-option";

              if (optionData.value === String(row[field.key] || "")) {
                optionButton.classList.add("active");
              }

              optionButton.textContent = optionData.text;
              optionButton.title = optionData.text;

              optionButton.onclick = function (event) {
                event.stopPropagation();
                row[field.key] = optionData.value;
                row.isModified = self._isModified(row);

                self._render();
                self._fire(
                  "onDataChange",
                  "fieldChange|" + index + "|" +
                  field.key + "|" + optionData.value
                );
              };

              optionList.appendChild(optionButton);
            });
          }

          trigger.onclick = function (event) {
            event.stopPropagation();

            var wasOpen = dropdown.classList.contains("open");
            self._closePopups();

            if (!wasOpen) {
              dropdown.classList.add("open");
              searchInput.value = "";
              renderDropdownOptions("");
              searchInput.focus();
            }
          };

          searchInput.oninput = function () {
            renderDropdownOptions(searchInput.value);
          };

          searchInput.onclick = function (event) {
            event.stopPropagation();
          };

          dropdown.appendChild(trigger);
          dropdown.appendChild(panel);
          td.appendChild(dropdown);
        }

        tr.appendChild(td);
      });

      return tr;
    }

    // =========================================================
    // PUBLIC METHODS USED BY SAC STORY SCRIPTING
    // =========================================================

    getLastEvent() {
      return this._lastEvent;
    }

    setData(raw) {
      var parsed = raw;

      try {
        if (typeof raw === "string") parsed = JSON.parse(raw);
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
      return JSON.stringify(this._rows.map(function (row) {
        return {
          assetId: row.assetId,
          description: row.description,
          company: row.company,
          costCenter: row.costCenter,
          assetClass: row.assetClass,
          additionalDescription: row.additionalDescription,
          capitalizedMonth: row.capitalizedMonth,
          selected: row.selected,
          isModified: row.isModified
        };
      }));
    }

    getSelectedData() {
      return JSON.stringify(this._selectedRows().map(function (row) {
        return {
          assetId: row.assetId,
          description: row.description,
          company: row.company,
          costCenter: row.costCenter,
          assetClass: row.assetClass,
          additionalDescription: row.additionalDescription,
          capitalizedMonth: row.capitalizedMonth,
          isModified: row.isModified
        };
      }));
    }

    getModifiedData() {
      return JSON.stringify(this._rows.filter(function (row) {
        return row.isModified;
      }).map(function (row) {
        return {
          assetId: row.assetId,
          description: row.description,
          company: row.company,
          costCenter: row.costCenter,
          assetClass: row.assetClass,
          additionalDescription: row.additionalDescription,
          capitalizedMonth: row.capitalizedMonth
        };
      }));
    }

    setOptions(fieldName, rawOptions) {
      if (!Object.prototype.hasOwnProperty.call(this._options, fieldName)) return;
      this._options[fieldName] = this._parseOptions(rawOptions);
      this._render();
    }

    setRowOptions(rowIndex, fieldName, rawOptions) {
      if (!Object.prototype.hasOwnProperty.call(this._options, fieldName)) return;
      if (!this._rowOptions[rowIndex]) this._rowOptions[rowIndex] = {};
      this._rowOptions[rowIndex][fieldName] = this._parseOptions(rawOptions);
      this._render();
    }

    setCellValue(rowIndex, fieldName, value) {
      if (!this._rows[rowIndex] ||
          !FIELDS.some(function (field) { return field.key === fieldName; })) {
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
        if (typeof rawIds === "string") ids = JSON.parse(rawIds);
      } catch (error) {
        this._message("Could not parse deleted asset IDs.");
        return;
      }

      if (!Array.isArray(ids)) return;

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
      if (search) search.value = "";

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
