import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  in_progress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Projects extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeOptionId: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.renderProjectsApi()
  }

  renderProjectsApi = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedList = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value}, this.renderProjectsApi)
  }

  renderLoadingView = () => (
    <div className="loadingContainer" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={20} width={20} />
    </div>
  )

  renderFailureView = () => {
    const retryApi = () => {
      this.renderProjectsApi()
    }
    return (
      <div className="loadingContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="image"
        />
        <h1 className="heading">Oops! Something Went Wrong</h1>
        <p className="describe">
          We cannot seem to find the page you are looking for.
        </p>
        <button type="button" className="retryBtn" onClick={retryApi}>
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="unorderedList">
        {projectsList.map(each => (
          <ProjectItem key={each.id} details={each} />
        ))}
      </ul>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.in_progress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div className="appContainer">
        <div className="headerContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="bodyContainer">
          <select
            value={activeOptionId}
            onChange={this.onChangeOption}
            className="selectContainer"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderApiStatus()}
        </div>
      </div>
    )
  }
}

export default Projects
