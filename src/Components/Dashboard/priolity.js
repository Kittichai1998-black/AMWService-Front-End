import { Avatar, Box, Card, CardHeader, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArticleIcon from '@mui/icons-material/Article';
import ErrorIcon from '@mui/icons-material/Error';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';

const Priolity = ({ data }) => {
  const statusdefault = [
    {name: "Immediate", status: 1 ,backgroundColor: '#FFA1A1', icon: <ErrorIcon/> ,iconBackgroundColor:'error.main'}, 
    {name: "Wait in 24 Hr.", status: 2 ,backgroundColor: '#FFD59E', icon: <AccessTimeIcon/> ,iconBackgroundColor:'warning.main'}, 
    {name: "Wait More 24 Hr.", status: 3,backgroundColor: '#B4FF9F', icon: <MoreTimeIcon/> ,iconBackgroundColor:'success.main'}
  ];

  return (
    <>
      <Card
        sx={{ height: '100%' }}
      >
        <CardHeader title="Priolity" />
        <CardContent>
          <Box sx={{ width: '100%' ,zoom:'83%'}}>
            <Stack spacing={2}>
              {statusdefault.map((x) => {
                return (
                  <Card
                    sx={{ height: '100%' ,backgroundColor: x.backgroundColor}}
                  >
                    <CardContent>
                      <Grid
                        container
                        spacing={3}
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <Grid item>
                          <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h5"
                          >
                            {x.name}
                          </Typography>
                          <Typography
                            color="textPrimary"
                            variant="h4"
                          >
                            {data.filter((y) => y.Priority_Id === x.status).length}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Avatar
                            sx={{
                              backgroundColor: x.iconBackgroundColor,
                              height: 56,
                              width: 56
                            }}
                          >
                            {x.icon}
                          </Avatar>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
export default Priolity
