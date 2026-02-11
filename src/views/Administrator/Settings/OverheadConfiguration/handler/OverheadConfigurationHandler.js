const columns = (isAction) => {
  const cols = [
    {
      title: "Label",
      field: "label",
      name: "label",
      editable: "never",
      cellStyle: {
        width: "30%",
      },
    },
    {
      title: "Value",
      field: "value",
      name: "value",
      type: "numeric",
      editable: "always",
      cellStyle: {
        width: "20%",
      },
    },
    {
      title: "Category",
      field: "category",
      name: "category",
      editable: "never",
      cellStyle: {
        width: "20%",
      },
    },
    {
      title: "Description",
      field: "description",
      name: "description",
      editable: "never",
      cellStyle: {
        width: "30%",
      },
    },
  ];

  if (isAction) {
    cols.unshift({
      title: "Actions",
      field: "actions",
      name: "actions",
      filtering: false,
      sorting: false,
      export: false,
      cellStyle: {
        width: 100,
        minWidth: 100,
      },
      headerStyle: {
        width: 100,
        minWidth: 100,
      },
    });
  }

  return cols;
};

const mapData = (data) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    id: item.key, // Use key as id for table operations
  }));
};

const OverheadConfigurationHandler = {
  columns,
  mapData,
};

export default OverheadConfigurationHandler;
