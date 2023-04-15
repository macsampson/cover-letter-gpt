import React, { useState, useEffect } from 'react'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

type Props = {
	open: boolean
	onAlertClose: (open: boolean) => void
}

function InputAlert({ open, onAlertClose }: Props) {
	// state object for alert
	let [alert, SetAlert] = useState(false)

	// set alert to open
	useEffect(() => {
		SetAlert(open)
	}, [open])

	const Popup = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref
	) {
		return (
			<MuiAlert
				elevation={6}
				ref={ref}
				variant="filled"
				{...props}
			/>
		)
	})

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		console.log('handleClose called')
		SetAlert(false)
		onAlertClose(false)
		if (reason === 'clickaway') {
			return
		}
	}

	return (
		<Snackbar
			open={alert}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		>
			<Popup
				onClose={handleClose}
				severity="error"
				sx={{ width: '100%' }}
			>
				Missing resume or job description!
			</Popup>
		</Snackbar>
	)
}

export default InputAlert
