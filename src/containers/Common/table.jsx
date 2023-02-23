import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button } from '@mui/material';
import * as scrape from "../../pages/Background/scrape-fetch.js";
import AdminRecent from "../Admin/recent";
import AdminDialog from './adminDialog.jsx';
import { useEffect } from "react";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const scheduleOptions = [
  {
    label: "Just Once",
  },
  {
    label: "Every Day",
  },
  {
    label: "Every Other Day",
  },
  {
    label: "Every Week",
  },
  {
    label: "Every Other Week",
  },
  {
    label: "Every Month",
  },
]

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'venue_base_url',
    numeric: false,
    disablePadding: true,
    label: 'Venue URL',
  },
  {
    id: 'frequency',
    numeric: false,
    disablePadding: false,
    label: 'Frequency',
  },
  {
    id: 'enabled',
    numeric: false,
    disablePadding: false,
    label: 'Enabled',
  },
  {
    id: 'last_run',
    numeric: false,
    disablePadding: false,
    label: 'Last Run',
  },
  {
    id: 'save',
    numeric: false,
    disablePadding: false,
    label: 'Save',
  },
  {
    id: 'download_recent',
    numeric: false,
    disablePadding: false,
    label: 'Download Recent',
  },
  // need to pass back the id of the mapper
  {
    id: 'display_recent',
    numeric: false,
    disablePadding: false,
    label: 'Display Recent',
  },
  {
    id: 'edit',
    numeric: false,
    disablePadding: false,
    label: 'Edit',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


function EnhancedTableToolbar(props) {
  const { numSelected, selected, email } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >

        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          User Mappers for {email}
        </Typography>

        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  // set the state
  // TODO fix this it errors
  const { email } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('lastRun');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const open = Boolean(anchorEl);
  // on load, get the data
  useEffect(() => {
    // get email from props
    // get the data from scrape
    scrape.adminUserMaps(email).then((data) => {
      if(!!!data) {
        return;
      }
      // set the rows to the data
      setRows(data);
    });
  }, []);

  const handleRequestSort = (event, property) => {
    console.log('handle request sort')
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const saveClick = (row) => {
    console.log('save click');
    console.log(row);

    scrape.updateScrape(row).then((data) => {
      console.log('update scrape');
      console.log(data);
    });

  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFrequencyClick = (event, row) => {
    setAnchorEl(event.currentTarget);
  };

  const setRowName = (event, row) => {
    row.name = event.target.value;
    setRows([...rows]);  
  }

  const handleMenuClose = (event, label) => {
    if(label) {
      setRows([...rows]);
    }
    setAnchorEl(null);
  };

  const displayRecent = (row) => {
    setCurrentRow(row);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setCurrentRow(null);
    setOpenDialog(false);
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} email={email} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.mapID}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell className='table-cell table-name' align="right">
                      <TextField 
                          id="standard-basic" 
                          label="Name" 
                          variant="standard"
                          value={row.name}
                          onChange={(event) => setRowName(event, row)}
                          />
                      </TableCell>
                      <TableCell className='table-cell' align="right">{row.url}</TableCell>
                      <TableCell className='table-cell' align="right">
                        <div className="dropdown">
                          <button className="btn btn-secondary dropdown-toggle drp-button-size" type="button"
                              aria-controls={open ? 'basic-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? 'true' : undefined}
                              onClick={(event) => { handleFrequencyClick(event, row) }}
                              id="basic-button">
                                {row.frequency}
                          </button>
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => handleMenuClose(undefined, undefined)}
                            MenuListProps={{
                              'aria-labelledby': 'basic-button',
                            }}
                          >
                            {scheduleOptions && scheduleOptions.map((item) => (
                              <MenuItem key={item.label} value={item.label} onClick={(event) => handleMenuClose(event, item.label)} disableRipple>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </TableCell>
                      <TableCell className='table-cell' align="right" padding='checkbox'>
                        <Checkbox
                          checked={row.enabled}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onChange={(event) => {
                            row.enabled = event.target.checked;
                            setRows([...rows]);
                          }}
                        />
                      </TableCell>
                      <TableCell className='table-cell' align="right">{row.lastRun}</TableCell>
                      <TableCell className='table-cell' align="right">
                        <Button onClick={() => saveClick(row)}>
                          Save
                        </Button>
                      </TableCell>
                      <TableCell className='table-cell' align="right">
                        <Button>
                          Download Recent
                        </Button>
                      </TableCell>
                      <TableCell className='table-cell' align="right" onClick={() => displayRecent(row)}>
                        <Button>
                          Show Recent
                        </Button>
                      </TableCell>
                      <TableCell className='table-cell' padding='checkbox' onClick={() => props.setEvent(row)}>
                        <Button>
                          Edit Scraper
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {openDialog ? <AdminDialog open={openDialog} setClose={handleCloseDialog} data={currentRow} /> : null}
    </Box>
  );
}