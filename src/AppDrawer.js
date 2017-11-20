import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


export default class AppDrawer extends Component{

    render() {
        return (
            <Drawer
              docked={false}
              width={200}
              open={this.props.openDrawer}
              onRequestChange={() => this.props.handleCloseDrawer()}
            >
              <MenuItem onTouchTap={() => this.props.handleLogout()}>Cerrar sesion</MenuItem>
              <MenuItem onTouchTap={() => this.props.mypetsChangeFalse()}>Inicio</MenuItem>
              <MenuItem onTouchTap={() => this.props.mypetsChangeTrue()}>Mis publicaciones</MenuItem>
            </Drawer>
        );
    }
}